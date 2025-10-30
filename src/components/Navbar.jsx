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
