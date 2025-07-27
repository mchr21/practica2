<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/"><font-awesome-icon icon="home" /> Home</router-link></li>
        <li><router-link to="/peliculas"><font-awesome-icon icon="film" /> Peliculas</router-link></li>
        <li><router-link to="/clientes"><font-awesome-icon icon="users" /> Clientes</router-link></li>
        <li><router-link to="/empleados"><font-awesome-icon icon="user-tie" /> Empleados</router-link></li>
        <li><router-link to="/alquiler"><font-awesome-icon icon="handshake" /> Alquiler</router-link></li>
      </ul>
    </nav>
  </header>
  <main>
    <router-view/>
  </main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  background-color: #f8f8f8;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
}

nav li a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  padding: 5px 10px;
  display: flex; /* Para alinear el icono y el texto */
  align-items: center; /* Para centrar verticalmente */
}

nav li a svg { /* Estilos para el icono SVG */
  margin-right: 5px; /* Espacio entre el icono y el texto */
}

nav li a:hover {
  color: #007bff;
}

main {
  padding: 20px;
}
</style>

