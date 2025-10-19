import { useNavigate } from "@tanstack/react-router";
import ProyectoTable from "./ProyectoTable";

const Proyecto = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate({ to: '/Home' });
  };

  return (
    <div className='w-full flex flex-col items-start h-full'>

      <ProyectoTable />
      {/* <-- Aquí llamas a la tabla */}
     
    </div>
  );
};

export default Proyecto;