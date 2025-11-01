import { useState, useRef, useEffect } from 'react'
import Avatar from './Avatar'
import { useAvatarManagement } from '../hooks/useAvatarManagement'

/**
 * AvatarMenu - Avatar cliccabile con dropdown menu
 * Da usare nella Navbar per gestire azioni utente
 * @param {string} userId - ID dell'utente corrente
 * @param {string} username - Nome utente o email da mostrare
 * @param {function} onLogout - Callback per logout
 * @param {function} onNavigateProfile - Callback per navigare al profilo
 * @param {function} onNavigateSettings - Callback per navigare alle impostazioni
 */
export default function AvatarMenu({ 
  userId, 
  username, 
  onLogout,
  onNavigateProfile,
  onNavigateSettings 
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const fileInputRef = useRef(null)
  
  const { avatarUrl, uploading, uploadAvatar, removeAvatar } = useAvatarManagement(userId)

  // Debug: verifica che l'hook restituisca l'URL
  useEffect(() => {
    console.log('AvatarMenu: received avatarUrl from hook:', avatarUrl)
  }, [avatarUrl])

  // Chiudi menu al click esterno o con Escape
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current?.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    
    function onEsc(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onEsc)
    
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadAvatar(file)
    }
    // Reset input per permettere ricaricamento stesso file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar cliccabile */}
      <Avatar
        avatarUrl={avatarUrl}
        username={username}
        size={40}
        isLoading={uploading}
        onClick={(e) => {
          e.stopPropagation()
          setMenuOpen(v => !v)
        }}
      />

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
          {/* Header con info utente */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate" title={username}>
              {username}
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate" title={userId}>
              {userId}
            </p>
          </div>

          {/* Upload foto */}
          <button
            onClick={() => {
              setMenuOpen(false)
              fileInputRef.current?.click()
            }}
            disabled={uploading}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-3 transition-colors"
          >
            <span className="text-lg">📷</span>
            <span>{uploading ? 'Caricamento...' : 'Carica foto profilo'}</span>
          </button>

          {/* Rimuovi foto - mostra solo se c'è un avatar */}
          {avatarUrl && (
            <button
              onClick={async () => {
                setMenuOpen(false)
                await removeAvatar()
              }}
              disabled={uploading}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">🗑️</span>
              <span>Rimuovi foto</span>
            </button>
          )}

          <div className="border-t border-gray-100 my-1"></div>

          {/* Profilo */}
          {onNavigateProfile && (
            <button
              onClick={() => {
                setMenuOpen(false)
                onNavigateProfile()
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">👤</span>
              <span>Il mio profilo</span>
            </button>
          )}

          {/* Impostazioni */}
          {onNavigateSettings && (
            <button
              onClick={() => {
                setMenuOpen(false)
                onNavigateSettings()
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">⚙️</span>
              <span>Impostazioni</span>
            </button>
          )}

          <div className="border-t border-gray-100 my-1"></div>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={() => {
                setMenuOpen(false)
                onLogout()
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">🚪</span>
              <span>Esci</span>
            </button>
          )}
        </div>
      )}

      {/* Input file nascosto per upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
