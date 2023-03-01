<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-button @click="registrarNuevaUnidad" type="is-info" class="mb-2"
          >Registrar nueva</b-button
        >
        <b-table :data="unidades" :striped="true">
          <b-table-column field="nombre" label="Nombre" v-slot="props">
            {{ props.row }}
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">No hay datos</div>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>
<script>
import { obtenerUnidades } from '@/services/UnidadesService';
export default {
  data: () => ({
    unidades: [],
  }),
  async mounted() {
    await this.obtenerUnidades();
  },
  methods: {
    registrarNuevaUnidad() {
      this.$router.push({
        name: "RegistrarUnidad",
      });
    },
    async obtenerUnidades() {
      this.unidades = await obtenerUnidades();
    },
  }
}
</script>