import { useNavigate } from "@tanstack/react-router";
import AbonadosTable from "./AbonadosTable";
const Abonados = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate({ to: '/Home' });
  }

  return (
    <div className='w-full flex flex-col items-start h-full'>
      <button
        onClick={handleButtonClick}
        className="mt-1 px-3 py-1 text-base bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition font-semibold"
      >
        Volver
      </button>
      <h1>Abonados</h1>
      <div className="w-full mt-4">
        <AbonadosTable />
      </div>
    </div>
  )

}


export default Abonados