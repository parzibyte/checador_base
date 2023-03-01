import { obtenerAjustes } from "./AjustesService";
import conexion from "./BaseDeDatosService"

export const insertarRol = async (nombre, rutas) => {
    const valoresInsertados = await conexion.insert({
        into: "roles",
        values: [{ nombre, rutas }],
        return: true,
    })
    return valoresInsertados[0];
}
export const obtenerRoles = async () => {
    return await conexion.select({
        from: "roles",
    });
}

export const eliminarRol = async (id) => {
    return await conexion.remove({
        from: "roles",
        where: {
            id,
        }
    });
}


export const obtenerRolSeleccionadoParaElDia = async () => {
    const ajustes = await obtenerAjustes();
    return ajustes.rolSeleccionado;
}