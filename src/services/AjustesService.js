import conexion from "./BaseDeDatosService"

export const guardarAjustes = async (rolSeleccionado) => {
    await conexion.remove({ from: "ajustes" });
    const valoresInsertados = await conexion.insert({
        into: "ajustes",
        values: [{ rolSeleccionado }],
        return: true,
    })
    return valoresInsertados[0];
}
export const obtenerAjustes = async () => {
    const ajustes = await conexion.select({
        from: "ajustes",
    });
    if (Array.isArray(ajustes) && ajustes.length > 0) {
        return ajustes[0];
    }
    return {};
}