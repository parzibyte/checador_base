<template>
  <div class="columns">
    <div class="column">
      <p>Ajustes</p>
      <b-field label="Limpiar tabla">
        <b-select v-model="tablaSeleccionada">
          <option :value="tabla" v-for="tabla in tablas" :key="tabla">
            {{ tabla }}
          </option>
        </b-select>
        <p class="control">
          <b-button @click="eliminarTablaSeleccionada()" type="is-danger">
            Limpiar
          </b-button>
        </p>
      </b-field>
      <b-button type="is-danger" @click="eliminarTodaLaBaseDeDatos"
        >Eliminar toda la base de datos</b-button
      >
    </div>
  </div>
</template>
<script>
import conexion from "@/services/BaseDeDatosService";
export default {
  data: () => ({
    tablaSeleccionada: "",
    tablas: ["rutas", "ajustes", "unidades", "roles"],
  }),
  methods: {
    async eliminarTodaLaBaseDeDatos() {
      this.$buefy.dialog.confirm({
        message: `¿Eliminar base de datos completa? esto no se puede deshacer`,
        cancelText: "Cancelar",
        confirmText: "Sí",
        onConfirm: async () => {
          await conexion.dropDb();
          this.$buefy.toast.open(
            "Base de datos eliminada. Tal vez sea necesario recargar"
          );
        },
      });
    },
    eliminarTablaSeleccionada() {
      if (!this.tablaSeleccionada) {
        return;
      }
      this.$buefy.dialog.confirm({
        message: `¿Vaciar tabla ${this.tablaSeleccionada}?`,
        cancelText: "Cancelar",
        confirmText: "Sí",
        onConfirm: async () => {
          await conexion.clear(this.tablaSeleccionada);
          this.$buefy.toast.open("Tabla limpiada");
        },
      });
    },
  },
};
</script>