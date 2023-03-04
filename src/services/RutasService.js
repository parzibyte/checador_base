import conexion from "./BaseDeDatosService"

export const insertarRuta = async (nombre, color) => {
    const valoresInsertados = await conexion.insert({
        into: "rutas",
        values: [{ nombre, color }],
        return: true,
    })
    return valoresInsertados[0];
}
export const obtenerRutas = async () => {
    return await conexion.select({
        from: "rutas",
    });
}

export const eliminarRuta = async (id) => {
    return await conexion.remove({
        from: "rutas",
        where: {
            id,
        }
    });
}