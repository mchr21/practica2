<template>
  <div class="home">
    <h1>Bienvenido al Sistema de Gestión de Películas</h1>
    <img
      alt="Cine"
      src="@/assets/portada.webp"
      class="main-image"
    />
  </div>
</template>


<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 20px;
}

.main-image {
  margin-top: 30px;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>


