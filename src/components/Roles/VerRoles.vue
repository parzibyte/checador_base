<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-button @click="registrarNuevoRol" type="is-info" class="mb-2">
          Registrar nuevo rol</b-button
        >
        <b-field label="¿Cuál rol se usa hoy?">
          <b-select
            v-model="rolSeleccionado"
            @input="onRolSeleccionadoCambiado"
          >
            <option :value="rol" v-for="rol in roles" :key="rol.id">
              {{ rol.nombre }}
            </option>
          </b-select>
        </b-field>
        <b-table :data="roles" :striped="true">
          <b-table-column field="nombre" label="Nombre" v-slot="props">
            {{ props.row.nombre }}
          </b-table-column>
          <b-table-column field="rutas" label="Orden" v-slot="props">
            {{ aplanarRutas(props.row.rutas) }}
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
import { eliminarRol, obtenerRoles, obtenerRolSeleccionadoParaElDia } from '@/services/RolesService';
import { guardarAjustes, } from '@/services/AjustesService';

export default {
  data: () => ({
    rolSeleccionado: {},
    roles: [],
  }),
  async mounted() {
    await this.obtenerRoles();
    this.rolSeleccionado = await obtenerRolSeleccionadoParaElDia();
  },
  methods: {
    async onRolSeleccionadoCambiado() {
      await guardarAjustes(this.rolSeleccionado);
      this.$buefy.toast.open("Cambiado correctamente");
    },
    async eliminar(rol) {
      this.$buefy.dialog.confirm({
        message: `¿Eliminar rol ${rol.nombre}?`,
        cancelText: "Cancelar",
        confirmText: "Sí",
        onConfirm: async () => {
          await eliminarRol(rol.id);
          await this.obtenerRoles();
        }
      });
    },
    aplanarRutas(rutas) {
      return rutas.map(ruta => ruta.nombre).join(", ");
    },
    registrarNuevoRol() {
      this.$router.push({ name: "RegistrarRol" });
    },
    async obtenerRoles() {
      this.roles = await obtenerRoles();
    },
  },
}
</script>