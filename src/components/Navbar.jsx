export default function Navbar({ profileUsername }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8">
          <button className="text-sm font-medium text-blue-500 border-b-2 border-blue-500 pb-3">
            Home
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-3">
            Projects
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-3">
            Tasks
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-3">
            Reports
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* Add Button */}
          <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
            <span className="text-xl text-gray-600">+</span>
          </button>

          {/* Notifications */}
          <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 relative">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <button className="w-9 h-9 flex items-center justify-center bg-gray-700 hover:bg-gray-800">
            <span className="text-white text-sm font-medium">
              {/* TODO: aggiungere immagine profilo */}
              {profileUsername ? profileUsername.charAt(0).toUpperCase() : 'U'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}
