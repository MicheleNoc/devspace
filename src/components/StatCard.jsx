export default function StatCard({ label, value, percentage, color }) {
  const colorClasses = {
    blue: 'text-blue-500',
    orange: 'text-orange-500',
    teal: 'text-teal-500',
    purple: 'text-purple-500'
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        <span className={`text-xs ${colorClasses[color]}`}>{percentage}</span>
      </div>
    </div>
  )
}
