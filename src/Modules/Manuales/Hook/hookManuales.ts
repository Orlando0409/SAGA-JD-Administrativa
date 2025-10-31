import { useQuery } from "@tanstack/react-query";

import type { Manual } from "../Models/ModelsManuales";
import {  getManuales } from "../Services/ServicesManuales";

//  Hook para obtener todos los manuales
export const useGetManuales = () => {
  return useQuery<Manual[], Error>({
    queryKey: ["manuales"],
    queryFn: getManuales,
    staleTime: 5 * 60 * 1000, 
    retry: 1, 
  });
};



