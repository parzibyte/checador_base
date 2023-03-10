import workerInjector from "jsstore/dist/worker_injector";

import { Connection } from "jsstore/";
import { DATA_TYPE } from "jsstore";

const obtenerBaseDeDatos = () => {
    const tablaUnidades = {
        name: "unidades",
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true,
                dataType: DATA_TYPE.Number,
            },
            prioridad: {
                autoIncrement: true,
                dataType: DATA_TYPE.Number,
            },
            numero: {
                notNull: true,
                dataType: DATA_TYPE.Number,
            },
            entrada: {
                dataType: DATA_TYPE.Number,
                notNull: true,
            },
            horaLlamada: {
                dataType: DATA_TYPE.Number,
                default: 0,
            },
            salida: {
                dataType: DATA_TYPE.Number,
                default: 0,
            },
            segundosDesdeSalidaAnterior: {
                notNull: true,
                dataType: DATA_TYPE.Number,
                default: 0,
            },
            esEspecial: {
                notNull: true,
                dataType: DATA_TYPE.Boolean,
                default: false,
            },
            ruta: {
                dataType: DATA_TYPE.Object,
                notNull: true
            },
        }
    };

    const tablaRutas = {
        name: "rutas",
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                notNull: true,
                dataType: DATA_TYPE.String,
            },
            color: {
                notNull: true,
                dataType: DATA_TYPE.String,
            }
        }
    };

    const tablaRoles = {
        name: "roles",
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                notNull: true,
                dataType: DATA_TYPE.String,
            },
            rutas: {
                notNull: true,
                dataType: DATA_TYPE.Array,
            }
        }
    };
    const tablaAjustes = {
        name: "ajustes",
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true
            },
            rolSeleccionado: {
                notNull: true,
                dataType: DATA_TYPE.Object,
            },
        }
    };
    const baseDeDatos = {
        name: "checador",
        tables: [tablaUnidades, tablaRutas, tablaRoles, tablaAjustes],
    };
    return baseDeDatos;
};

const conexion = new Connection();
conexion.addPlugin(workerInjector);
export default conexion;
export const iniciarBaseDeDatos = async () => {
    const baseDeDatos = obtenerBaseDeDatos();
    return await conexion.initDb(baseDeDatos);
};
