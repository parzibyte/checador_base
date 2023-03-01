<template>
  <div>
    <b-field label="Nueva ruta">
      <b-input v-model="nombre" placeholder="Nombre"></b-input>
    </b-field>
    <b-field label="Color">
      <b-colorpicker v-model="color" />
    </b-field>
    <b-field label="Válida desde">
      <b-timepicker
        v-model="horarioInicio"
        rounded
        icon="clock"
        hour-format="24"
        locale="es-MX"
      >
      </b-timepicker>
    </b-field>

    <b-field label="Hasta">
      <b-timepicker
        v-model="horarioFin"
        rounded
        icon="clock"
        hour-format="24"
        locale="es-MX"
      >
      </b-timepicker>
    </b-field>
    <b-button type="is-info" @click="guardar">Guardar</b-button>
    <b-button class="ml-2" type="is-primary" @click="volver">Volver</b-button>
  </div>
</template>
<script>
import { insertarRuta } from "../../services/RutasService";
import Color from "buefy/src/utils/color"
export default {
  data: () => ({
    nombre: "",
    color: Color.parse("#8bc34a"),
    horarioInicio: new Date(),
    horarioFin: new Date(),
  }),
  mounted() {
    const inicio = new Date();
    inicio.setHours(6, 0, 0, 0);
    const fin = new Date();
    fin.setHours(20, 0, 0, 0);
    this.horarioInicio = inicio;
    this.horarioFin = fin;
  },
  methods: {
    volver() {
      this.$router.go(-1);
    },
    async guardar() {
      if (!this.nombre) {
        return;
      }
      await insertarRuta(this.nombre, this.horarioInicio.getTime(), this.horarioFin.getTime(), this.color.toString());
      this.nombre = "";
      this.color = Color.parse("#8bc34a");
      this.$buefy.toast.open("Guardada");
    }
  }
}
</script>