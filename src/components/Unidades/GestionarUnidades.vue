<template>
  <div>
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
              <b-dropdown-item>Reemplazar con Huapaltepec</b-dropdown-item>
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
import { llamarUnidad, obtenerUnidades } from "@/services/UnidadesService";
import conexion from "@/services/BaseDeDatosService";
export default {
  data: () => ({
    cargando: false,
    unidades: [],
    horaActual: new Date(),
    idTimeout: null,
  }),
  async mounted() {
    this.refrescarHora();
    await this.obtenerUnidades();
  },
  beforeDestroy() {
    clearTimeout(this.idTimeout);
  },
  methods: {
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
      console.log({indice});
      if (indice + 1 < this.unidades.length) {
        const siguienteUnidad = this.unidades[indice+1];
        console.log({siguienteUnidad});
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
      this.unidades = await obtenerUnidades(
        1677692874827,
        new Date().getTime()
      );
      this.cargando = false;
    },
  },
};
</script>