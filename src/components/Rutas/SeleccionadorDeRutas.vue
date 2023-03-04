<template>
  <b-field>
    <b-select expanded v-model="ruta">
      <option v-for="ruta in rutas" :value="ruta" :key="ruta.id">
        {{ ruta.nombre }}
      </option>
    </b-select>
    <p class="control">
      <b-button @click="guardar" type="is-primary" label="Ok" />
    </p>
  </b-field>
</template>
<script>
import { obtenerRutas } from "@/services/RutasService";
export default {
  data: () => ({
    rutas: [],
    ruta: {},
  }),
  async mounted() {
    this.rutas = await obtenerRutas();
  },
  methods: {
    guardar() {
      if (!this.ruta.id) {
        return;
      }
      this.$emit("seleccionada", this.ruta);
    },
  },
};
</script>