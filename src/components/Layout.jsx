import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import supabase from '../supabaseClient'

export default function Layout({ children, profileUsername, onLogout }) {
  const [activeSection, setActiveSection] = useState('home')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    if (onLogout) onLogout()
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar profileUsername={profileUsername} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
