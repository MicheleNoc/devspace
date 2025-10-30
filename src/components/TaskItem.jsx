export default function TaskItem({ title, time, tag }) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
      <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">📅 {time}</span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{tag}</span>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600">⋯</button>
    </div>
  )
}
