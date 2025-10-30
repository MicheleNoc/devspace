import Avatar from './Avatar.jsx'

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
          <Avatar user={profileUsername} size={36} />
        </div>
      </div>
    </nav>
  )
}
