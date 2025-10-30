export default function ProjectCard({ image, category, title, description, teamSize }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{category}</p>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <button className="text-sm text-blue-500 hover:text-blue-600">View all</button>
          <div className="flex -space-x-2">
            {[...Array(Math.min(teamSize, 3))].map((_, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs"
              >
                👤
              </div>
            ))}
            {teamSize > 3 && (
              <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                +{teamSize - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
