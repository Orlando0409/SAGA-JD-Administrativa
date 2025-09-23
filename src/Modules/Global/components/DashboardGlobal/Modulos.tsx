import { useAllowedModules } from '../../../Auth/provider/PermisoProvider'
import ModuleCard from './ModuleCard'

const Modulos = () => {
  const { allowedModules } = useAllowedModules()

  return (
    <section className="bg-gray-100 rounded-lg shadow-md h-full overflow-y-auto">
      <div className="p-4">
        <div className="mb-4 flex items-center">
          <h1 className="text-3xl md:text-5xl font-bold text-start py-4">
            Panel Administrativo ASADA Juan Díaz
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allowedModules.map((mod, index) => (
            <ModuleCard 
              key={`${mod.name}-${index}`}
              name={mod.name} 
              icon={mod.icon} 
              path={mod.path} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Modulos