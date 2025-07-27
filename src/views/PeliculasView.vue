<template>
  <div class="peliculas container">
    <h1 class="my-4">Peliculas</h1>
    
    <div class="d-flex justify-content-start mb-3">
      <button class="btn btn-primary" @click="mostrarModal">Nueva Pelicula</button>
    </div>

    <div class="mb-3">
      <select id="director-filter" v-model="directorSeleccionado" @change="aplicarFiltro" class="form-select">
        <option value="">Todos los Directores</option>
        <option v-for="director in directores" :key="director" :value="director">{{ director }}</option>
      </select>
    </div>

    <div class="mb-3">
      <input 
        id="title-search"
        v-model="busqueda" 
        type="text" 
        class="form-control" 
        placeholder="Buscar por titulo"
        @input="aplicarFiltro"
      >
    </div>


    <table v-if="peliculas.length" class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Género</th>
          <th>Año</th>
          <th>Director</th>
          <th>Stock Disponible</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pelicula in peliculas" :key="pelicula.id">
          <td>{{ pelicula.id }}</td>
          <td>{{ pelicula.titulo }}</td>
          <td>{{ pelicula.genero }}</td>
          <td>{{ pelicula.año }}</td>
          <td>{{ pelicula.director }}</td>
          <td>{{ pelicula.stock }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" @click="editarPelicula(pelicula.id)">Editar</button>
            <button class="btn btn-sm btn-danger" @click="eliminarPelicula(pelicula.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para nueva película -->
    <div class="modal fade" id="movieModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ tituloVentanaModal }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Título</label>
                <input v-model="peliculaActual.titulo" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Género</label>
                <input v-model="peliculaActual.genero" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Año</label>
                <input v-model="peliculaActual.año" type="number" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Director</label>
                <input v-model="peliculaActual.director" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Stock Disponible</label>
                <input v-model="peliculaActual.stock" type="number" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

export default {
  name: 'PeliculasView',
  data() {
    return {
      busqueda: '',
      peliculas: [],
      todasLasPeliculas: [], 
      directorSeleccionado: '',
      peliculaActual: {
        id: null,
        titulo: '',
        genero: '',
        año: '',
        director: '',
        stock: 0
      },
      editando: false,
      modal: null
    };
  },
  computed: {
    tituloVentanaModal() {
      return this.editando ? 'Editar Película' : 'Nueva Película';
    },
    directores() {
      const directors = this.todasLasPeliculas.map(pelicula => pelicula.director);
      return [...new Set(directors)].sort();
    },
  },
  created() {
    this.obtenerPeliculas();
  },
  mounted() {
    this.modal = new Modal(document.getElementById('movieModal'));
  },
  methods: {
    async obtenerPeliculas() {
      try {
        const response = await axios.get('http://localhost:3000/peliculas');
        this.todasLasPeliculas = response.data; // Guardar todas las películas
        this.aplicarFiltro(); // Aplicar filtro
      } catch (err) {
        console.error("Error al obtener películas:", err);
      }
    },
    aplicarFiltro() {
      let peliculasFiltradas = this.todasLasPeliculas;

      if (this.directorSeleccionado) {
        peliculasFiltradas = peliculasFiltradas.filter(pelicula => pelicula.director === this.directorSeleccionado);
      }

      if (this.busqueda) {
        peliculasFiltradas = peliculasFiltradas.filter(pelicula => 
          pelicula.titulo.toLowerCase().includes(this.busqueda.toLowerCase())
        );
      }
      this.peliculas = peliculasFiltradas;
    },
    mostrarModal() {
      this.editando = false;
      this.peliculaActual = {
        id: null,
        titulo: '',
        genero: '',
        año: '',
        director: '',
        stock: 0
      };
      this.modal.show();
    },
    async editarPelicula(id) {
      try {
        const response = await axios.get(`http://localhost:3000/peliculas/${id}`);
        this.peliculaActual = response.data;
        this.editando = true;
        this.modal.show();
      } catch (err) {
        console.error("Error al obtener película:", err);
      }
    },
    async handleSubmit() {
      try {
        if (this.editando) {
          await axios.put(`http://localhost:3000/peliculas/${this.peliculaActual.id}`, this.peliculaActual);
        } else {
          await axios.post('http://localhost:3000/peliculas', this.peliculaActual);
        }
        this.modal.hide();
        this.obtenerPeliculas();
      } catch (err) {
        console.error("Error al guardar película:", err);
      }
    },
    async eliminarPelicula(id) {
      if (confirm('Se eliminara la pelicula seleccionada')) {
        try {
          await axios.delete(`http://localhost:3000/peliculas/${id}`);
          this.obtenerPeliculas();
        } catch (err) {
          console.error("Error al eliminar película:", err);
        }
      }
    }
  }
};
</script>

<style scoped>
.peliculas {
  text-align: center;
  padding: 20px;
}
.search-container {
  width: 300px;
  margin-bottom: 1rem; /* Added margin for spacing */
}
</style>