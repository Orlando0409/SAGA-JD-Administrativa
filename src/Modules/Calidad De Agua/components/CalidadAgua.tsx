import { useNavigate } from "@tanstack/react-router";
import CalidadAguaTable from "./CalidadAguaTable";

const CalidadAgua = () => {
  const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate({ to: '/Home' });
    }

  return (
    <div className='w-full flex flex-col items-start h-full'>
       
        <h1>Calidad de Agua</h1>
        <CalidadAguaTable />
         <button
            onClick={handleButtonClick}
            className="mt-1 px-3 py-1 text-base bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition font-semibold"
        >
            Volver
        </button>
    </div>
  )

}

export default CalidadAgua