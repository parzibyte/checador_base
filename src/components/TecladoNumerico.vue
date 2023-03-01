<template>
  <div style="max-width: 300px" class="has-text-centered">
    <b-button
      size="is-large"
      @click="teclaPresionada(tecla)"
      type="is-primary"
      class="m-2"
      v-for="tecla in teclado"
      :key="tecla"
      >{{ tecla }}</b-button
    >
    <b-button size="is-large" @click="borrar" class="m-2" type="is-warning">
      <b-icon icon="backspace"></b-icon
    ></b-button>
    <b-button size="is-large" @click="borrarTodo" class="m-2" type="is-danger"
      >C</b-button
    >
  </div>
</template>
<script>
export default {
  data: () => ({
    teclado: "1234567890".split(""),
  }),
  methods: {
    borrarTodo() {
      this.$emit("borrarTodo");
    },
    teclaPresionada(tecla) {
      this.$emit("teclaPresionada", tecla);
    },
    borrar() {
      this.$emit("borrar");
    },
  }
}

</script>