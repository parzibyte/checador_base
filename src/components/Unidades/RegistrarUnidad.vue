<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <b-field label="Hora">
          <b-timepicker
            v-model="unidad.hora"
            rounded
            icon="clock"
            :enable-seconds="true"
            :hour-format="'24'"
            locale="es-MX"
          >
          </b-timepicker>
        </b-field>
        <b-field label="Ruta">
          <b-select expanded v-model="unidad.ruta">
            <option v-for="ruta in rutas" :value="ruta" :key="ruta.id">
              {{ ruta.nombre }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Número de unidad">
          <b-input v-model.number="unidad.numero"></b-input>
        </b-field>
        <teclado-numerico
          @teclaPresionada="onTeclaPresionada"
          @borrar="onTeclaBorrada"
          @borrarTodo="onBorrarTodo"
        />
        <div class="has-text-centered">
          <b-button
            class="mr-6"
            @click="guardar"
            size="is-large"
            type="is-success"
            >Guardar</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TecladoNumerico from "../TecladoNumerico.vue";
import { obtenerRutas } from "@/services/RutasService";
import {
  insertarUnidad,
  obtenerConteoUnidadesIncluyendoSalidas,
} from "@/services/UnidadesService";
import { obtenerRolSeleccionadoParaElDia } from "@/services/RolesService";
export default {
  components: { TecladoNumerico },
  data: () => ({
    unidad: {
      hora: new Date(),
      numero: null,
      ruta: null,
    },
    rutas: [],
    rolSeleccionado: {},
  }),
  async mounted() {
    this.rutas = await obtenerRutas();
    this.rolSeleccionado = await obtenerRolSeleccionadoParaElDia();
    this.elegirRutaAutomaticamenteSegunRol();
    this.refrescarHora();
  },
  methods: {
    async elegirRutaAutomaticamenteSegunRol() {
      const cantidadUnidades = await obtenerConteoUnidadesIncluyendoSalidas(
        0,
        new Date().getTime()
      );
      let indice = cantidadUnidades % this.rolSeleccionado.rutas.length; // Magia TODO: restar especiales y ver si en el índice no hay una deshabilitada
      const rutaSegunRol = this.rolSeleccionado.rutas[indice];
      this.unidad.ruta = rutaSegunRol;
    },
    async guardar() {
      if (!this.unidad.numero) {
        return;
      }
      if (!this.unidad.ruta) {
        return;
      }
      await insertarUnidad(
        this.unidad.numero,
        this.unidad.hora.getTime(),
        this.unidad.ruta
      );
      this.$buefy.toast.open("Guardada");
      this.unidad = {
        hora: new Date(),
        numero: null,
        ruta: null,
      };
      this.$router.push({
        name: "GestionarUnidades",
      });
      //await this.elegirRutaAutomaticamenteSegunRol();
    },
    onBorrarTodo() {
      this.unidad.numero = null;
    },
    refrescarHora() {
      this.unidad.hora = new Date();
      setTimeout(this.refrescarHora, 500);
    },
    onTeclaPresionada(tecla) {
      let numeroComoCadena = "";
      if (this.unidad.numero) {
        numeroComoCadena = this.unidad.numero.toString();
      }
      numeroComoCadena += tecla;
      this.unidad.numero = parseInt(numeroComoCadena);
    },
    onTeclaBorrada() {
      let numeroComoCadena = "";
      if (this.unidad.numero) {
        numeroComoCadena = this.unidad.numero.toString();
      }
      numeroComoCadena = numeroComoCadena.split("").slice(0, -1).join("");
      if (numeroComoCadena) {
        this.unidad.numero = parseInt(numeroComoCadena);
      } else {
        this.unidad.numero = null;
      }
    },
  },
};
</script>