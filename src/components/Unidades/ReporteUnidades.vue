<template>
  <div class="columns">
    <div class="column">
      <p :style="{backgroundColor:unidad.ruta.color}" v-for="unidad in unidades" :key="unidad.id">
        {{ unidad.numero }} {{unidad.ruta.nombre}} {{unidad.salida | fechaAPartirDeMilisegundos}} 
      </p>
    </div>
  </div>
</template>
<script>
import { obtenerTodasLasUnidadesParaReporte } from "@/services/UnidadesService";
export default {
  data: () => ({
    unidades: [],
  }),
  async mounted() {
    await this.obtenerUnidades();
  },
  methods: {
    async obtenerUnidades() {
      this.unidades = await obtenerTodasLasUnidadesParaReporte();
    },
  },
};
</script>