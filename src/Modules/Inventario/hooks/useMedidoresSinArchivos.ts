import { useMemo } from 'react';
import { useMedidoresPorEstado } from './useMedidores';


export const useMedidoresSinArchivos = (enabled: boolean = true) => {
    const { data: medidoresInstalados = [] } = useMedidoresPorEstado('instalados', enabled);

    return useMemo(() => {
        const conArchivosFaltantes = medidoresInstalados.filter(
            (m) => !m.Certificacion_Literal || !m.Planos_Terreno,
        );

        const conteoPorAfiliado = new Map<number, number>();
        for (const m of conArchivosFaltantes) {
            const idAfiliado = m.Afiliado?.Id_Afiliado;
            if (idAfiliado) {
                conteoPorAfiliado.set(idAfiliado, (conteoPorAfiliado.get(idAfiliado) ?? 0) + 1);
            }
        }

        return {
            totalMedidoresSinArchivos: conArchivosFaltantes.length,
            conteoPorAfiliado,
            medidoresSinArchivos: new Set(conArchivosFaltantes.map((m) => m.Id_Medidor)),
        };
    }, [medidoresInstalados]);
};
