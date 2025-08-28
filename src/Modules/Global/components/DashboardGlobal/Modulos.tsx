
import { useAllowedModules } from '../../../Auth/provider/PermisoProvider'
import ModuleCard from './ModuleCard'

const Modulos = () => {
  const { allowedModules } = useAllowedModules()

  return (
    <section className="bg-gray-100 rounded-lg p-4 shadow-md">
      <div className="mb-4 flex items-center">
        <h1 className="w-lg text-5xl font-bold text-start py-4">Panel Administrativo ASADA Juan Díaz</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {allowedModules.map((mod) => (
          <ModuleCard key={mod.name} name={mod.name} icon={mod.icon} path={mod.path} />
        ))}
      </div>
    </section>
  )
}

export default Modulos