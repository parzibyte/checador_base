<template>
  <div>
    <div class="container">
      <div class="columns">
        <div class="column">
          <b-field label="Hora">
            <b-timepicker
              v-model="unidad.hora"
              rounded
              icon="clock"
              :enable-seconds="true"
              hour-format="24"
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
          <b-button @click="guardar" size="is-large" type="is-success"
            >Guardar</b-button
          >
          <b-button class="ml-2" @click="volver" size="is-large" type="is-info"
            >Volver</b-button
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
  obtenerConteoUnidadesEspeciales,
  obtenerConteoUnidadesIncluyendoSalidas,
} from "@/services/UnidadesService";
import { obtenerRolSeleccionadoParaElDia } from "@/services/RolesService";
export default {
  props: ["esHijo"],
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
    volver() {
      this.$router.go(-1);
    },
    async elegirRutaAutomaticamenteSegunRol() {
      if (!this.rolSeleccionado) {
        this.$buefy.toast.open(
          "No hay ningún rol seleccionado, imposible determinar ruta automáticamente"
        );
        return;
      }
      const cantidadUnidades = await obtenerConteoUnidadesIncluyendoSalidas(
        0,
        new Date().getTime()
      );
      const cantidadUnidadesEspeciales = await obtenerConteoUnidadesEspeciales(
        0,
        new Date().getTime()
      );
      let indice =
        (cantidadUnidades - cantidadUnidadesEspeciales) %
        this.rolSeleccionado.rutas.length; // Magia TODO: restar especiales y ver si en el índice no hay una deshabilitada
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
      if (this.esHijo) {
        this.$emit("guardado", this.unidad);
        return;
      }
      await insertarUnidad(
        this.unidad.numero,
        this.unidad.hora.getTime(),
        this.unidad.ruta,
        false
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