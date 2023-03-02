<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-button @click="registrarNuevaUnidad" type="is-info" class="mb-2"
          >Registrar nueva</b-button
        >
        <b-table :data="unidades" :striped="true">
          <b-table-column field="numero" label="Numero" v-slot="props">
            {{ props.row.numero }}
          </b-table-column>
          <b-table-column field="entrada" label="Entrada" v-slot="props">
            {{ props.row.entrada | fechaAPartirDeMilisegundos }}
            <strong>
              {{ transcurrido(props.row.entrada) | fechaAPartirDeMilisegundos }}
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
              <b-dropdown-item @click="darSalida(props.row)"
                >Dar salida</b-dropdown-item
              >
              <b-dropdown-item @click="moverHaciaAdelante(props.index)"
                >Mover hacia adelante</b-dropdown-item
              >
              <b-dropdown-item>Asignar tacopan</b-dropdown-item>
              <b-dropdown-item @click="eliminarDeLaLista(props.index)"
                >Eliminar de la lista</b-dropdown-item
              >
              <b-dropdown-item>Mover al fondo</b-dropdown-item>
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
import { obtenerUnidades } from '@/services/UnidadesService';
import conexion from '@/services/BaseDeDatosService';
export default {
  data: () => ({
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
    async eliminarUnidad(id) {
      await conexion.remove({
        from: "unidades",
        where: {
          id,
        }
      });
    },
    async eliminarDeLaLista(indice) {
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
          }
        });
      }
      await this.eliminarUnidad(this.unidades[indice].id);
      await this.obtenerUnidades();
    },
    async darSalida(unidad) {
      await conexion.update({
        in: "unidades",
        set: {
          salida: new Date().getTime(),
          segundosDesdeSalidaAnterior: 999,//TODO: obtener de un lugar confiable
        },
        where: {
          id: unidad.id,
        }
      });
      this.$buefy.toast.open("Salida marcada correctamente");
      await this.obtenerUnidades();
    },
    transcurrido(entrada) {
      const transcurrido = new Date(this.horaActual - new Date(entrada));
      transcurrido.setTime(transcurrido.getTime() + transcurrido.getTimezoneOffset() * 60 * 1000)
      return transcurrido;
    },
    refrescarHora() {
      this.horaActual = new Date();
      clearTimeout(this.idTimeout);
      this.idTimeout = setTimeout(this.refrescarHora, 500);
    },
    async moverHaciaAdelante(indice) {
      if (indice <= 0) {
        this.$buefy.toast.open("No se puede mover hacia adelante la primera unidad");
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
        }
      });
      await conexion.update({
        in: "unidades",
        set: {
          entrada: unidadActual.entrada,
          numero: unidadActual.numero,
        },
        where: {
          id: unidadAnterior.id,
        }
      });
      await this.obtenerUnidades();
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
      this.unidades = await obtenerUnidades(1677692874827, new Date().getTime());
    },
  }
}
</script>