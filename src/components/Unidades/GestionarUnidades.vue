<template>
  <div>
    <b-modal
      :active.sync="mostrarModalAgregarUnidad"
      aria-modal
      aria-role="dialog"
      has-modal-card
      :destroy-on-hide="true"
      trap-focus
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <registrar-unidad
            @guardado="onUnidadAgregadaAdelante"
            :esHijo="true"
          />
        </section>
        <footer class="modal-card-foot">
          <b-button @click="cerrarModalAgregarUnidad()">Cancelar</b-button>
        </footer>
      </div>
    </b-modal>
    <div class="columns">
      <div class="column">
        <b-button @click="registrarNuevaUnidad" type="is-info" class="mb-2"
          >Registrar nueva</b-button
        >
        <b-table :loading="cargando" :data="unidades" :striped="true">
          <b-table-column field="numero" label="Numero" v-slot="props">
            {{ props.row.numero }}
          </b-table-column>
          <b-table-column field="entrada" label="Entrada" v-slot="props">
            {{ props.row.entrada | fechaAPartirDeMilisegundos }}
            <strong
              :style="estiloDeStrong(props.row.horaLlamada)"
              v-if="props.row.horaLlamada"
            >
              {{
                transcurrido(props.row.horaLlamada) | fechaAPartirDeMilisegundos
              }}
            </strong>
            <b-tag type="is-info" v-show="!props.row.horaLlamada">
              Sale
              {{ calcularSalida(props.index) | fechaAPartirDeMilisegundos }}
            </b-tag>
          </b-table-column>
          <b-table-column
            :td-attrs="atributosCelda"
            field="ruta"
            label="Ruta"
            v-slot="props"
          >
            {{ props.row.ruta.nombre }}
          </b-table-column>
          <b-table-column field="numero" label="Opciones" v-slot="props">
            <b-dropdown>
              <template #trigger="{ active }">
                <b-button
                  label="Opciones"
                  type="is-primary"
                  :icon-right="active ? 'menu-up' : 'menu-down'"
                />
              </template>
              <b-dropdown-item class="has-text-centered">
                Unidad
                <strong>{{ props.row.numero }} </strong>
                para
                <strong> {{ props.row.ruta.nombre }}</strong>
              </b-dropdown-item>
              <b-dropdown-item
                v-show="!props.row.horaLlamada"
                @click="llamar(props.row.id)"
                >Llamar</b-dropdown-item
              >
              <b-dropdown-item
                v-show="props.row.horaLlamada"
                @click="darSalida(props.index)"
                >Dar salida</b-dropdown-item
              >
              <b-dropdown-item @click="moverHaciaAdelante(props.index)"
                >Mover hacia adelante</b-dropdown-item
              >
              <b-dropdown-item>Asignar tacopan</b-dropdown-item>
              <b-dropdown-item @click="eliminarDeLaLista(props.index)"
                >Eliminar de la lista</b-dropdown-item
              >
              <b-dropdown-item @click="moverAlFondo(props.index)"
                >Mover al fondo</b-dropdown-item
              >
              <b-dropdown-item @click="agregarUnidadAdelante(props.index)"
                >Tepepan</b-dropdown-item
              >
              <b-dropdown-item @click="tacopan(props.index)"
                >Tacopan</b-dropdown-item
              >
            </b-dropdown>
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
import {
  insertarUnidad,
  llamarUnidad,
  obtenerUnidades,
} from "@/services/UnidadesService";
import conexion from "@/services/BaseDeDatosService";
import RegistrarUnidad from "./RegistrarUnidad.vue";
export default {
  components: { RegistrarUnidad },
  data: () => ({
    cargando: false,
    unidades: [],
    horaActual: new Date(),
    idTimeout: null,
    mostrarModalAgregarUnidad: false,
    indiceUnidadEditada: {},
  }),
  async mounted() {
    this.refrescarHora();
    await this.obtenerUnidades();
  },
  beforeDestroy() {
    clearTimeout(this.idTimeout);
  },
  methods: {
    calcularSalida(indice) {
      if (this.unidades.length <= 0) {
        return 0;
      }
      const primeraUnidad = this.unidades[0];
      if (!primeraUnidad.horaLlamada) {
        return 0;
      }
      return primeraUnidad.horaLlamada + indice * 1000 * 60 * 2.5;
    },
    async tacopan(indice) {
      const unidad = this.unidades[indice];
      await conexion.update({
        in: "unidades",
        set: {
          ruta: {
            nombre: "Tacopan--",
          },
          esEspecial: true,
        },
        where: {
          id: unidad.id,
        },
      });
      for (let i = indice + 1; i < this.unidades.length; i++) {
        await conexion.update({
          in: "unidades",
          set: {
            ruta: this.unidades[i - 1].ruta,
          },
          where: {
            id: this.unidades[i].id,
          },
        });
      }
      await this.obtenerUnidades();
    },
    async onUnidadAgregadaAdelante(unidad) {
      const unidadEditada = this.unidades[this.indiceUnidadEditada];
      this.mostrarModalAgregarUnidad = false;
      const unidadRecienInsertada = await insertarUnidad(
        unidad.numero,
        unidad.hora.getTime(),
        unidad.ruta,
        true
      );
      await conexion.update({
        in: "unidades",
        set: {
          prioridad: unidadEditada.prioridad,
        },
        where: {
          id: unidadRecienInsertada.id,
        },
      });
      for (let i = this.indiceUnidadEditada; i < this.unidades.length; i++) {
        await conexion.update({
          in: "unidades",
          set: {
            prioridad: this.unidades[i].prioridad + 1,
          },
          where: {
            id: this.unidades[i].id,
          },
        });
      }
      await this.obtenerUnidades();
    },
    cerrarModalAgregarUnidad() {
      this.mostrarModalAgregarUnidad = false;
    },
    agregarUnidadAdelante(indice) {
      this.indiceUnidadEditada = indice;
      this.mostrarModalAgregarUnidad = true;
      // Agregar nueva unidad adelante, solicitar número y ruta que por defecto puede ser Huapaltepec
      // (las demás se recorren sin ningún cambio, solo en el orden). Eso es para Huapaltepec
    },
    estiloDeStrong(horaLlamada) {
      const ahora = new Date();
      const diferencia = ahora - horaLlamada;
      const minutoYMedioEnMilisegundos = 90000;
      if (diferencia >= minutoYMedioEnMilisegundos) {
        return { backgroundColor: "red" };
      }
      return {};
    },
    async llamar(id) {
      await llamarUnidad(id);
      await this.obtenerUnidades();
    },
    async moverAlFondo(indice) {
      for (let i = indice + 1; i < this.unidades.length; i++) {
        await this.moverHaciaAdelante(i);
      }
    },
    async eliminarUnidad(id) {
      this.cargando = true;
      await conexion.remove({
        from: "unidades",
        where: {
          id,
        },
      });
      this.cargando = false;
    },
    async eliminarDeLaLista(indice) {
      this.cargando = true;
      const cantidadDeUnidades = this.unidades.length;
      for (let i = indice; i < cantidadDeUnidades - 1; i++) {
        const siguienteUnidad = this.unidades[i + 1];
        const unidadActual = this.unidades[i];
        await conexion.update({
          in: "unidades",
          set: {
            ruta: unidadActual.ruta,
          },
          where: {
            id: siguienteUnidad.id,
          },
        });
      }
      await this.eliminarUnidad(this.unidades[indice].id);
      await this.obtenerUnidades();
      this.cargando = false;
    },
    async darSalida(indice) {
      const unidad = this.unidades[indice];
      this.cargando = true;
      await conexion.update({
        in: "unidades",
        set: {
          salida: new Date().getTime(),
          segundosDesdeSalidaAnterior: 999, //TODO: obtener de un lugar confiable
        },
        where: {
          id: unidad.id,
        },
      });
      this.$buefy.toast.open("Salida marcada correctamente");
      if (indice + 1 < this.unidades.length) {
        const siguienteUnidad = this.unidades[indice + 1];
        // Agregar nueva unidad adelante, solicitar número y ruta que por defecto puede ser Huapaltepec (las demás se recorren sin ningún cambio, solo en el orden). Eso es para Huapaltepec
        // Cambiar ruta y recorrer  hacia abajo
        // Mostrar tiempo transcurrido desde la salida de la anterior a la misma ruta, ordenar por fecha de salida descendente donde la ruta sea igual a la ruta actual
        if (!siguienteUnidad.horaLlamada) {
          this.llamar(siguienteUnidad.id);
        }
      }
      await this.obtenerUnidades();
      this.cargando = false;
    },
    transcurrido(entrada) {
      const transcurrido = new Date(this.horaActual - new Date(entrada));
      transcurrido.setTime(
        transcurrido.getTime() + transcurrido.getTimezoneOffset() * 60 * 1000
      );
      return transcurrido;
    },
    refrescarHora() {
      this.horaActual = new Date();
      clearTimeout(this.idTimeout);
      this.idTimeout = setTimeout(this.refrescarHora, 500);
    },
    async moverHaciaAdelante(indice) {
      this.cargando = true;
      if (indice <= 0) {
        this.$buefy.toast.open(
          "No se puede mover hacia adelante la primera unidad"
        );
        return;
      }

      const unidadAnterior = this.unidades[indice - 1];
      const unidadActual = this.unidades[indice];
      await conexion.update({
        in: "unidades",
        set: {
          entrada: unidadAnterior.entrada,
          numero: unidadAnterior.numero,
        },
        where: {
          id: unidadActual.id,
        },
      });
      await conexion.update({
        in: "unidades",
        set: {
          entrada: unidadActual.entrada,
          numero: unidadActual.numero,
        },
        where: {
          id: unidadAnterior.id,
        },
      });
      await this.obtenerUnidades();
      this.cargando = false;
    },
    atributosCelda(unidad) {
      return {
        style: { backgroundColor: unidad.ruta.color },
      };
    },
    registrarNuevaUnidad() {
      this.$router.push({
        name: "RegistrarUnidad",
      });
    },
    async obtenerUnidades() {
      this.cargando = true;
      let unidades = await obtenerUnidades(1677692874827, new Date().getTime());
      /*
      console.log({unidades});
      for(let i = 0;i<unidades.length;i++){
        const unidad = unidades[i];

        unidad.ultimaUnidadALaMismaRuta = {
          numero: 10,
          salida: 9000,
        };
        unidades[i]=unidad;
      }
      unidades =  unidades.map(async (unidad) => {
        console.log("eee");
        const a = await obtenerUltimaUnidadALaMismaRuta(
          unidad.ruta.id,
          0,
          new Date().getTime()
        );
        console.log({ a });
        return unidad;
      });
      console.log({unidades});
      */
      this.unidades = unidades;
      this.cargando = false;
    },
  },
};
</script>