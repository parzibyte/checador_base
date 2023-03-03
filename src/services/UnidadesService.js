import conexion from "./BaseDeDatosService"

export const insertarUnidad = async (numero, entrada, ruta) => {
    const valoresInsertados = await conexion.insert({
        into: "unidades",
        values: [{ numero, entrada, ruta, salida: 0, segundosDesdeSalidaAnterior: 0, horaLlamada: 0 }],
        return: true,
    })
    return valoresInsertados[0];
}
export const llamarUnidad = async (id) => {
    return await conexion.update({
        in: "unidades",
        set: {
            horaLlamada: new Date().getTime()
        },
        where: {
            id,
        }
    })
}
export const obtenerUnidades = async (inicio, fin) => {
    return await conexion.select({
        from: "unidades",
        where: {
            entrada: {
                "-": {
                    low: inicio,
                    high: fin
                }
            },
            salida: 0,
        },
        order: {
            by: "id",
            type: "asc",
        }

    });
}

export const obtenerConteoUnidadesIncluyendoSalidas = async (inicio, fin) => {
    return await conexion.count({
        from: "unidades",
        where: {
            entrada: {
                "-": {
                    low: inicio,
                    high: fin
                }
            },
        },
    });
}
