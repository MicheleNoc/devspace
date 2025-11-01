import { useState, useEffect, useCallback } from 'react'
import supabase from '../supabaseClient'

/**
 * Hook personalizzato per gestire avatar utente
 * Gestisce: caricamento, upload, rimozione avatar
 */
export function useAvatarManagement(userId) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  /**
   * Carica l'URL dell'avatar dal profilo utente
   */
  const loadAvatar = useCallback(async () => {
    try {
      console.log('useAvatarManagement: loading avatar for user', userId)
      
      // Ottieni avatar_path dal profilo
      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_path')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.warn('useAvatarManagement: could not load profile', profileError)
        setAvatarUrl(null)
        return
      }

      const avatarPath = profileRow?.avatar_path
      
      if (!avatarPath) {
        console.log('useAvatarManagement: no avatar_path found')
        setAvatarUrl(null)
        return
      }

      // Prova a ottenere URL pubblico
      const publicRes = supabase.storage.from('avatars').getPublicUrl(avatarPath)
      const publicUrl = publicRes?.data?.publicUrl ?? publicRes?.publicURL ?? publicRes?.publicUrl ?? publicRes?.public_url

      if (publicUrl) {
        console.log('useAvatarManagement: got public URL', publicUrl)
        console.log('useAvatarManagement: setting avatarUrl state to', publicUrl)
        setAvatarUrl(publicUrl)
        console.log('useAvatarManagement: avatarUrl state updated')
        return
      }

      // Fallback: prova signed URL (per bucket privati)
      const { data: signedData, error: signedError } = await supabase.storage
        .from('avatars')
        .createSignedUrl(avatarPath, 3600)

      if (signedError) {
        console.warn('useAvatarManagement: createSignedUrl error', signedError)
        setAvatarUrl(null)
        return
      }

      console.log('useAvatarManagement: got signed URL')
      setAvatarUrl(signedData?.signedUrl || null)
    } catch (err) {
      console.error('useAvatarManagement: loadAvatar error', err)
      setAvatarUrl(null)
    }
  }, [userId])

  // Carica avatar quando cambia userId
  useEffect(() => {
    if (!userId) {
      setAvatarUrl(null)
      return
    }
    loadAvatar()
  }, [userId, loadAvatar])

  /**
   * Upload nuovo avatar
   * @param {File} file - File immagine da caricare
   */
  async function uploadAvatar(file) {
    if (!file) {
      console.warn('useAvatarManagement: no file provided to uploadAvatar')
      return
    }
    
    if (!userId) {
      console.warn('useAvatarManagement: no userId available for upload')
      return
    }

    setUploading(true)
    try {
      console.log('useAvatarManagement: uploading file', {
        name: file.name,
        size: file.size,
        type: file.type
      })

      const fileExt = file.name.split('.').pop()
      const fileName = `avatar.${fileExt}`
      const filePath = `${userId}/${fileName}`

      console.log('useAvatarManagement: uploading to path', filePath)

      // Upload file (upsert per sovrascrivere se esiste)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        console.error('useAvatarManagement: upload error', uploadError)
        throw uploadError
      }

      console.log('useAvatarManagement: upload successful')

      // Aggiorna profilo con nuovo path
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({ id: userId, avatar_path: filePath })

      if (dbError) {
        console.error('useAvatarManagement: database update error', dbError)
        throw dbError
      }

      console.log('useAvatarManagement: profile updated')

      // Ricarica avatar per aggiornare UI
      await loadAvatar()
    } catch (err) {
      console.error('useAvatarManagement: uploadAvatar error', err)
      // Potresti voler gestire l'errore (es. mostrare un toast)
    } finally {
      setUploading(false)
    }
  }

  /**
   * Rimuove l'avatar corrente
   */
  async function removeAvatar() {
    if (!userId) {
      console.warn('useAvatarManagement: no userId available for removal')
      return
    }

    setUploading(true)
    try {
      console.log('useAvatarManagement: removing avatar for user', userId)

      // Lista tutti i file nella cartella utente
      const { data: list, error: listError } = await supabase.storage
        .from('avatars')
        .list(userId)

      if (listError) {
        console.warn('useAvatarManagement: list error', listError)
      }

      // Rimuovi tutti i file trovati
      if (list?.length) {
        const paths = list.map(f => `${userId}/${f.name}`)
        console.log('useAvatarManagement: removing files', paths)
        
        const { error: removeError } = await supabase.storage
          .from('avatars')
          .remove(paths)

        if (removeError) {
          console.warn('useAvatarManagement: remove error', removeError)
        } else {
          console.log('useAvatarManagement: files removed successfully')
        }
      } else {
        console.log('useAvatarManagement: no files to remove')
      }

      // Aggiorna profilo rimuovendo avatar_path
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({ id: userId, avatar_path: null })

      if (dbError) {
        console.error('useAvatarManagement: database update error', dbError)
        throw dbError
      }

      console.log('useAvatarManagement: profile updated, avatar removed')
      setAvatarUrl(null)
    } catch (err) {
      console.error('useAvatarManagement: removeAvatar error', err)
    } finally {
      setUploading(false)
    }
  }

  return { 
    avatarUrl, 
    uploading, 
    uploadAvatar, 
    removeAvatar,
    reloadAvatar: loadAvatar
  }
}
