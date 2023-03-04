<template>
  <div>
    <b-navbar type="is-primary">
      <template #start>
        <b-navbar-item tag="router-link" :to="{ name: 'VerRutas' }"
          ><b-icon icon="routes" class="mr-1"></b-icon> Rutas</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'GestionarUnidades' }"
          ><b-icon icon="bus-multiple" class="mr-1"></b-icon>
          Unidades</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'VerRoles' }"
          ><b-icon icon="sync" class="mr-1"></b-icon> Roles</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'Ajustes' }">
          <b-icon icon="cog" class="mr-1"></b-icon> Ajustes</b-navbar-item
        >
      </template>
    </b-navbar>
    <section style="padding:0.1rem;" class="section">
      <router-view />
    </section>
  </div>
</template>

<script>
import { iniciarBaseDeDatos } from "./services/BaseDeDatosService"
export default {
  name: 'app',
  async beforeCreate() {
    const ok = await iniciarBaseDeDatos();
    console.log({ ok });
  },

}
</script>