import Avatar from './Avatar.jsx'

export default function Navbar({ profileUsername }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8">
         
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <Avatar profileUsername={profileUsername} size={36} />
        </div>
      </div>
    </nav>
  )
}
