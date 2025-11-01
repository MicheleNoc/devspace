import { useState, useEffect } from 'react'
import AvatarMenu from './AvatarMenu.jsx'
import supabase from '../supabaseClient.jsx'

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Ottieni utente corrente
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user)
    })

    // Ascolta cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Errore durante il logout:', error)
    }
  }

  const handleNavigateProfile = () => {
    window.location.href = '/profile'
  }

  const handleNavigateSettings = () => {
    window.location.href = '/settings'
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8">
          <div className="font-bold text-xl text-gray-800">DevSpace</div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Profile Menu */}
          {user && (
            <AvatarMenu
              userId={user.id}
              username={user.email || user.user_metadata?.username || 'User'}
              onLogout={handleLogout}
              onNavigateProfile={handleNavigateProfile}
              onNavigateSettings={handleNavigateSettings}
            />
          )}
        </div>
      </div>
    </nav>
  )
}
