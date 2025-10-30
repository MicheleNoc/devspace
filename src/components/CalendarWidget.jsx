export default function CalendarWidget() {
  const days = ['Mon', 'Tre', 'Wed', 'Thu', 'Fri', 'Sat', 'Sat']
  const dates = [26, 27, 28, 29, 30, 1, 2]
  const today = 26

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Calendar</h3>
        <button className="text-sm text-blue-500 hover:text-blue-600">See all</button>
      </div>

      {/* Date Display */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Today</p>
        <p className="text-xl font-semibold">Monday, 26 June 2023</p>
      </div>

      {/* Mini Calendar */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{day}</div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm ${
                dates[index] === today
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {dates[index]}
            </div>
          </div>
        ))}
      </div>

      {/* Events */}
      <div className="space-y-3">
        <EventItem
          time="08:00 am"
          title="Task planing"
          description="Review daily tasks and set priorities"
          color="blue"
        />
        <EventItem
          time="09:05 am"
          title="Do not disturb"
          description="Work on my daily task"
          color="gray"
        />
        <EventItem
          time="11:20 am"
          title="Daily catch-up with design team"
          description="New app design and development"
          color="yellow"
        />
        <EventItem
          time="02:40 pm"
          title="Lunch break"
          color="white"
        />
        <EventItem
          time="02:40 pm"
          title="Team brainstorm"
          description="New app design and development"
          color="orange"
        />
      </div>
    </div>
  )
}

function EventItem({ time, title, description, color }) {
  const colorClasses = {
    blue: 'border-l-blue-500 bg-blue-50',
    gray: 'border-l-gray-300 bg-gray-50',
    yellow: 'border-l-yellow-400 bg-yellow-50',
    white: 'border-l-gray-200 bg-white',
    orange: 'border-l-orange-400 bg-orange-50'
  }

  return (
    <div className={`border-l-4 ${colorClasses[color]} p-3 rounded-r-lg`}>
      <p className="text-xs text-gray-500 mb-1">{time}</p>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {description && <p className="text-xs text-gray-600 mt-1">{description}</p>}
    </div>
  )
}
