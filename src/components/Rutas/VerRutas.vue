<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-button @click="registrarNuevaRuta" type="is-info" class="mb-2"
          >Registrar nueva</b-button
        >
        <b-table :data="rutas" :striped="true">
          <b-table-column
            :td-attrs="atributosCelda"
            field="color"
            label="Color"
          >
            &nbsp;
          </b-table-column>
          <b-table-column field="nombre" label="Nombre" v-slot="props">
            {{ props.row.nombre }}
          </b-table-column>
          <b-table-column field="id" label="Horario" v-slot="props">
            {{ props.row.horarioInicio }} a {{ props.row.horarioFin }}
          </b-table-column>
          <b-table-column field="id" label="Eliminar" v-slot="props">
            <b-button @click="eliminar(props.row)" type="is-danger">
              <b-icon icon="delete"></b-icon>
            </b-button>
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
import { eliminarRuta, obtenerRutas } from '@/services/RutasService'
export default {
  data: () => ({
    rutas: [],
  }),
  async mounted() {
    await this.obtenerRutas();
  },
  methods: {
    atributosCelda(ruta) {
      return {
        style: { backgroundColor: ruta.color },
      };
    },
    registrarNuevaRuta() {
      this.$router.push({
        name: "RegistrarRuta",
      });
    },
    async obtenerRutas() {
      this.rutas = await obtenerRutas();
    },
    async eliminar(ruta) {
      this.$buefy.dialog.confirm({
        message: `¿Eliminar ruta ${ruta.nombre}?`,
        cancelText: "Cancelar",
        confirmText: "Sí",
        onConfirm: async () => {
          await eliminarRuta(ruta.id);
          await this.obtenerRutas();
        }
      });
    }
  }
}
</script>