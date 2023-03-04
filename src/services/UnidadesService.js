import conexion from "./BaseDeDatosService"

export const insertarUnidad = async (numero, entrada, ruta, esEspecial) => {
    esEspecial = esEspecial || false;
    const valoresInsertados = await conexion.insert({
        into: "unidades",
        values: [{ numero, entrada, ruta, esEspecial, salida: 0, segundosDesdeSalidaAnterior: 0, horaLlamada: 0 }],
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
            by: "prioridad",
            type: "asc",
        }

    });
}

export const obtenerUltimaUnidadALaMismaRuta = async (idRuta, inicio, fin) => {
    console.log({idRuta});
    return await conexion.select({
        from: "unidades",
        where: {
            entrada: {
                "-": {
                    low: inicio,
                    high: fin
                }
            },
            horaLlamada: {
                "!=": 0,
            },
           
        },
        order: {
            by: "horaLlamada",
            type: "desc",
        }

    });
}


export const obtenerConteoUnidadesEspeciales = async (inicio, fin) => {
    return await conexion.count({
        from: "unidades",
        where: {
            entrada: {
                "-": {
                    low: inicio,
                    high: fin
                }
            },
            esEspecial: true,
        },
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
