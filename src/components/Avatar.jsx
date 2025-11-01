/**
 * Componente Avatar - Solo visualizzazione
 * Componente presentazionale puro che mostra l'avatar dell'utente
 * @param {string} avatarUrl - URL dell'immagine avatar
 * @param {string} username - Nome utente da mostrare come fallback
 * @param {number} size - Dimensione del cerchio in pixel
 * @param {boolean} isLoading - Stato di caricamento
 * @param {function} onClick - Handler per click sull'avatar
 */
export default function Avatar({ 
  avatarUrl, 
  username, 
  size = 36, 
  isLoading = false, 
  onClick 
}) {
  // Aggiungi timestamp per evitare cache
  const imageUrl = avatarUrl ? `${avatarUrl}?t=${Date.now()}` : null

  return (
    <div
      onClick={onClick}
      style={{ 
        width: size, 
        height: size,
        minWidth: size,
        minHeight: size
      }}
      className="rounded-full overflow-hidden bg-gray-200 flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex-shrink-0"
      title="Menu utente"
      role="button"
      tabIndex={0}
    >
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        </div>
      ) : imageUrl ? (
        <img 
          src={imageUrl} 
          alt="avatar" 
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            console.error('Avatar: image load error', {
              src: e.target.src,
              avatarUrl,
              error: 'Failed to load image'
            })
          }}
          onLoad={() => {
            console.log('Avatar: image loaded successfully', imageUrl)
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-600 font-semibold">
          {username?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
    </div>
  )
}
