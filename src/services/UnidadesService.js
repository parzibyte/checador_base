import conexion from "./BaseDeDatosService"

export const insertarUnidad = async (numero, entrada, ruta) => {
    const valoresInsertados = await conexion.insert({
        into: "unidades",
        values: [{ numero, entrada, ruta, salida: 0, segundosDesdeSalidaAnterior: 0, }],
        return: true,
    })
    return valoresInsertados[0];
}
export const obtenerUnidades = async () => {
    return await conexion.select({
        from: "unidades",
    });
}
