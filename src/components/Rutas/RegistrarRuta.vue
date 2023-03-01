<template>
  <div>
    <b-field label="Nueva ruta">
      <b-input v-model="nombre" placeholder="Nombre"></b-input>
    </b-field>
    <b-button type="is-info" @click="guardar">Guardar</b-button>
    <b-button class="ml-2" type="is-primary" @click="volver">Volver</b-button>
  </div>
</template>
<script>
import { insertarRuta} from "../../services/RutasService";
export default {
  data: () => ({
    nombre: "",
  }),
  methods: {
    volver() {
      this.$router.go(-1);
    },
    async guardar() {
      if (!this.nombre) {
        return;
      }
      await insertarRuta(this.nombre);
      this.nombre = "";
      this.$buefy.toast.open("Guardada");
    }
  }
}
</script>