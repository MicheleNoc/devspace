import { useState } from 'react'

export default function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true)

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home', color: 'bg-blue-500' },
    { id: 'calendar', icon: '📅', label: 'Calendar' },
    { id: 'inbox', icon: '📥', label: 'Inbox' },
    { id: 'productivity', icon: '⚙️', label: 'Productivity' },
  ]

  const favoriteItems = [
    { id: 'kanban', label: 'Kanban board', count: 24 },
    { id: 'design', label: 'Design', count: 24 },
    { id: 'development', label: 'Development', count: 24 },
  ]

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">📋</span>
        </div>
        <span className="font-semibold text-lg">planit</span>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Favorites Section */}
        <div className="mt-6">
          <button
            onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg"
          >
            <span className="text-lg">⭐</span>
            <span className="flex-1 text-left font-medium">Favorite</span>
            <span className={`transform transition-transform ${isFavoritesOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {isFavoritesOpen && (
            <div className="mt-1 space-y-1">
              {favoriteItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 pl-9 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-gray-400">{item.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Workspace Section */}
        <div className="mt-6">
          <button
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg"
          >
            <span className="text-lg">💼</span>
            <span className="flex-1 text-left font-medium">Work space</span>
            <span className={`transform transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg"
        >
          <span className="text-lg">🚪</span>
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}
