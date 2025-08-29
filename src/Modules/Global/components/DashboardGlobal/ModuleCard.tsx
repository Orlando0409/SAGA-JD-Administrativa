import { Link } from '@tanstack/react-router'
import React from 'react'

interface ModuleCardProps {
  name: string
  icon: React.ReactNode
  path: string
}

const ModuleCard: React.FC<ModuleCardProps> = ({ name, icon, path }) => {
  return (
    <Link
      to={path}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white shadow-sm p-4 min-w-[140px] min-h-[110px] transition-colors hover:border-blue-400 hover:bg-blue-50"
    >
      <div className="text-4xl">{icon}</div>
      <span className="text-center text-sm font-medium text-gray-800">
        {name}
      </span>
    </Link>
  )
}

export default ModuleCard