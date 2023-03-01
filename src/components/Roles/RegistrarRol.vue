<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-field label="Nombre">
          <b-input v-model="rol.nombre" placeholder="Nombre"></b-input>
        </b-field>
        <b-field
          :label="'#' + (indice + 1)"
          v-for="(ruta, indice) in rol.rutas"
          :key="indice"
        >
          <b-select v-model="rol.rutas[indice]">
            <option :value="ruta" v-for="ruta in rutas" :key="ruta.id">
              {{ ruta.nombre }}
            </option>
          </b-select>
          <p class="control" v-show="deberiaMostrarBotonAgregar(indice)">
            <b-button @click="agregarRuta" type="is-info">
              <b-icon icon="plus"></b-icon>
            </b-button>
          </p>
          <p class="control" v-show="deberiaMostrarBotonEliminar()">
            <b-button @click="removerRuta(indice)" type="is-danger">
              <b-icon icon="delete"></b-icon>
            </b-button>
          </p>
        </b-field>
        <b-button
          :disabled="!formularioEsValido()"
          type="is-success"
          @click="guardar"
          >Guardar</b-button
        >
        <b-button class="ml-2" @click="volver" type="is-info">Volver</b-button>
      </div>
    </div>
  </div>
</template>
<script>
import { obtenerRutas } from '@/services/RutasService'
import { insertarRol } from '@/services/RolesService'
export default {
  data: () => ({
    rutas: [],
    rol: {
      nombre: "",
      rutas: [{}],
    }
  }),
  async mounted() {
    this.rutas = await obtenerRutas();
  },
  methods: {
    volver() {
      this.$router.go(-1);
    },
    formularioEsValido() {
      if (!this.rol.nombre) {
        return false;
      }
      for (const ruta of this.rol.rutas) {
        if (!ruta.nombre) {
          return false;
        }
      }
      return true;
    },
    async guardar() {
      await insertarRol(this.rol.nombre, this.rol.rutas);
      this.$buefy.toast.open("Guardado");
      this.rol = {
        nombre: "",
        rutas: [{}],
      };
    },
    deberiaMostrarBotonAgregar(indice) {
      if (indice + 1 === this.rol.rutas.length) {
        return true;
      }
      return false;
    },
    deberiaMostrarBotonEliminar() {
      if (this.rol.rutas.length > 1) {
        return true;
      }
      return false;
    },
    agregarRuta() {
      this.rol.rutas.push({});
    },
    removerRuta(indice) {
      this.rol.rutas.splice(indice, 1);
    },
  }
}
</script>