import { useState } from 'react'

export default function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home', color: 'bg-blue-500' },
    { id: 'project', icon: '📁', label: 'Progetti' },
    { id: 'calendar', icon: '📅', label: 'Calendario' },
  ]


  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gray-50 border-r border-gray-200 h-screen flex flex-col transition-all`}> 
      {/* Logo */}
      <div className={`p-4 border-b border-gray-200 flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
        <div className="rounded-lg flex items-center justify-center p-1">
          <span className="text-blue-500 text-lg">{isCollapsed ? '' : 'DevSpace'}</span>
        </div>
        <span className={`${isCollapsed ? 'hidden' : 'font-semibold text-lg'}`}>planit</span>

        <button
          onClick={() => setIsCollapsed((v) => !v)}
          className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
          title={isCollapsed ? 'Apri sidebar' : 'Riduci sidebar'}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      {/* Main Menu */}
      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-3'}`}>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              title={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`${isCollapsed ? 'hidden' : 'font-medium'}`}>{item.label}</span>
            </button>
          ))}
        </div>

        
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2 px-3'} py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg`}
          title="Log out"
        >
          <span className="text-lg">🚪</span>
          <span className={`${isCollapsed ? 'hidden' : ''}`}>Log out</span>
        </button>
      </div>
    </div>
  )
}
