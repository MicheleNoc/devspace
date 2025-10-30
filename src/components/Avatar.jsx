import { useState, useEffect, useRef } from 'react'
import  supabase  from '../supabaseClient.jsx'

export default function Avatar({ profileUsername, size = 36 }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // Use a local currentUser so we can fallback to supabase.auth.getUser()
  const [currentUser, setCurrentUser] = useState(profileUsername || null)
  const fileInputRef = useRef(null)
  const menuRef = useRef(null)

  // Recupera URL pubblico (o signed) dal path salvato nel profilo
  // Keep currentUser in sync with prop `profileUsername` and fallback to supabase.auth.getUser()
  useEffect(() => {
    let mounted = true
    if (profileUsername) {
      setCurrentUser(profileUsername)
      return
    }

    async function fetchUser() {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.warn('Avatar: supabase.auth.getUser error', error)
          return
        }
        if (mounted && data?.user) setCurrentUser(data.user)
      } catch (err) {
        console.error('Avatar: error fetching user', err)
      }
    }

    fetchUser()
    return () => {
      mounted = false
    }
  }, [profileUsername])

  // Load avatar when we have a currentUser
  useEffect(() => {
    if (!currentUser) return
    async function load() {
      // avatar_path may be stored on the auth user object (user_metadata)
      // or in the separate `profiles` table. Try both: prefer currentUser.profile/user_metadata,
      // otherwise fetch from `profiles` table by id.
      let avatarPath = currentUser?.profile?.avatar_path || currentUser?.user_metadata?.avatar_path
      console.log('Avatar: load start', { userId: currentUser?.id, avatarPath })

      if (!avatarPath) {
        try {
          const { data: profileRow, error: profileError } = await supabase
            .from('profiles')
            .select('avatar_path')
            .eq('id', currentUser.id)
            .single()

          if (profileError) {
            console.warn('Avatar: could not load profile row', profileError)
          } else {
            avatarPath = profileRow?.avatar_path
            console.log('Avatar: avatarPath from profiles table', avatarPath)
          }
        } catch (err) {
          console.error('Avatar: error querying profiles table', err)
        }
      }

      if (!avatarPath) {
        setAvatarUrl(null)
        console.log('Avatar: no avatarPath, cleared avatarUrl')
        return
      }

      // Try to resolve a usable URL for the avatar. getPublicUrl may return different
      // shapes depending on the supabase-js version or the bucket visibility.
      try {
        const publicRes = supabase.storage.from('avatars').getPublicUrl(avatarPath)
        console.log('Avatar: getPublicUrl response', publicRes)
        const publicUrl = publicRes?.data?.publicUrl ?? publicRes?.publicURL ?? publicRes?.publicUrl ?? publicRes?.public_url

        if (publicUrl) {
          setAvatarUrl(publicUrl)
          console.log('Avatar: got publicURL', publicUrl)
          return
        }

        // Fallback: try a signed URL (useful if the bucket is private)
        const { data: signedData, error: signedError } = await supabase.storage.from('avatars').createSignedUrl(avatarPath, 60)
        if (signedError) {
          console.warn('Avatar: createSignedUrl error', signedError)
          setAvatarUrl(null)
          return
        }
        console.log('Avatar: got signedUrl', signedData?.signedUrl)
        setAvatarUrl(signedData?.signedUrl || null)
      } catch (err) {
        console.error('Avatar: error resolving avatar url', err)
        setAvatarUrl(null)
      }
    }
    load()
  }, [currentUser])

  async function handleFile(e) {
    // Support different event shapes and programmatic calls: try event.target.files,
    // event.currentTarget.files, then fallback to the input ref's files.
    const rawFiles = e?.target?.files ?? e?.currentTarget?.files ?? fileInputRef.current?.files
    if (!rawFiles) {
      console.warn('Avatar: handleFile called but no files found', { hasEvent: !!e, fileInputFiles: fileInputRef.current?.files })
      return
    }
  const file = rawFiles[0]
  // Guard: if there is no selected file or no user, bail out with clear logs.
  if (!file) {
    // rawFiles can be a FileList of length 0 — log useful context for debugging.
    console.warn('Avatar: no file selected', { hasEvent: !!e, rawFilesLength: rawFiles.length })
    return
  }
  if (!currentUser) {
    console.warn('Avatar: no user available while handling file upload')
    return
  }
  console.log('Avatar: handleFile user', { id: currentUser?.id, email: currentUser?.email })
    setUploading(true)
    try {
      console.log('Avatar: file selected', { name: file.name, size: file.size, type: file.type })
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar.${fileExt}`
  const filePath = `${currentUser.id}/${fileName}`

      console.log('Avatar: uploading to', filePath)

      // upload (upsert true per sovrascrivere)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      console.log('Avatar: upload response', { uploadData, uploadError, uploadErrorMessage: uploadError?.message, uploadErrorStatus: uploadError?.status })

      if (uploadError) {
        // log and rethrow to be caught by outer catch
        console.error('Avatar: uploadError details', uploadError)
        throw uploadError
      }

      // Salva il path nel profilo (tavola 'profiles' o user_metadata)
      // Esempio con tabella 'profiles' (id = user.id)
      const { data: dbData, error: dbError } = await supabase
        .from('profiles')
        .upsert({ id: currentUser.id, avatar_path: filePath }, { returning: 'minimal' })

      console.log('Avatar: profiles upsert response', { dbData, dbError, dbErrorMessage: dbError?.message })

      if (dbError) {
        console.error('Avatar: dbError details', dbError)
        throw dbError
      }

      // Ottieni public URL e aggiorna UI
      const { publicURL } = supabase.storage.from('avatars').getPublicUrl(filePath)
      console.log('Avatar: publicURL after upload', publicURL)
      setAvatarUrl(publicURL)
      // reset input so same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
        console.log('Avatar: file input reset')
      }
    } catch (err) {
      console.error('Avatar upload error', err)
    } finally {
      setUploading(false)
    }
  }

  // close menu on outside click or Escape
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    function onEsc(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  return (
    <div className="relative flex items-center gap-2">
      <div style={{ width: size, height: size }} className="block rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {uploading ? (
          <div className="flex items-center justify-center w-full h-full text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          </div>
        ) : avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-600">
            {profileUsername || 'U'}
          </div>
        )}
      </div>

      {/* Dropdown trigger */}
      <div className="relative">
        <div ref={menuRef} className="relative">
          <button
            onClick={(ev) => {
              ev.stopPropagation()
              setMenuOpen((v) => !v)
            }}
            className="w-8 h-8 flex items-center text-red-600 justify-center border border-gray-200 rounded-md hover:bg-gray-50"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            title="Opzioni avatar"
          >
            ⋯
          </button>

          {menuOpen && (
            // Ensure dropdown text is dark on the white background by setting an explicit text color
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-sm z-50 text-gray-700">
              <button
                className={`w-full text-left px-3 py-2 text-sm ${uploading || !currentUser ? 'text-gray-400' : 'text-blue-600 hover:bg-gray-100'}`}
                onClick={() => {
                  if (uploading || !currentUser) return
                  setMenuOpen(false)
                  fileInputRef.current?.click()
                }}
                disabled={uploading || !currentUser}
                title={!currentUser ? 'Devi essere loggato per caricare' : undefined}
              >
                {uploading ? 'Caricamento...' : 'Carica foto'}
              </button>

              <button
                className={`w-full text-left px-3 py-2 text-sm ${(uploading || !currentUser) ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={async (ev) => {
                  ev.stopPropagation()
                  if (uploading) return
                  setMenuOpen(false)
                  try {
                    if (!currentUser) return
                      // remove all files under user's folder (safer than assuming avatar.png)
                      console.log('Avatar: removing files for user', currentUser.id)
                      const { data: list, error: listError } = await supabase.storage.from('avatars').list(`${currentUser.id}`)
                      console.log('Avatar: list response', { list, listError })
                      const paths = (list || []).map((f) => `${currentUser.id}/${f.name}`)
                      if (paths.length) {
                        const { data: removeData, error: removeError } = await supabase.storage.from('avatars').remove(paths)
                        console.log('Avatar: remove response', { removeData, removeError })
                      } else {
                        console.log('Avatar: no files to remove')
                      }
                      const { data: dbDataRemove, error: dbErrorRemove } = await supabase.from('profiles').upsert({ id: currentUser.id, avatar_path: null }, { returning: 'minimal' })
                      console.log('Avatar: profiles upsert (remove) response', { dbDataRemove, dbErrorRemove })
                      setAvatarUrl(null)
                  } catch (err) {
                    console.error('Remove avatar error', err)
                  }
                }}
                disabled={uploading || !currentUser}
              >
                Rimuovi foto
              </button>
            </div>
          )}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}