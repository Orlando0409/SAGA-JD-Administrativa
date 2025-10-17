import { useNavigate } from "@tanstack/react-router";
import CalidadAguaTable from "./CalidadAguaTable"; // <-- Importa el componente de la tabla

const CalidadAgua = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate({ to: '/Home' });
  };

  return (
    <div className='w-full flex flex-col items-start h-full'>


      <CalidadAguaTable /> {/* <-- Aquí llamas a la tabla */}

    </div>
  );
};

export default CalidadAgua;