<template>
  <div class="container mt-4">
    <h1 class="mb-4">Clientes</h1>

    <div class="d-flex justify-content-start mb-3">
      <button class="btn btn-primary" @click="mostrarModalNuevoCliente">
        Nuevo Cliente
      </button>
    </div>

    <div class="d-flex justify-content-between mb-3">
      <input
        type="text"
        class="form-control w-25 me-2"
        placeholder="Buscar por nombre..."
        v-model="filtroNombre"
        @input="aplicarFiltros"
      />
      <select class="form-select w-25"
        v-model="filtroCalificacion"
        @change="aplicarFiltros"
      >
        <option value="">Todas las Calificaciones</option>
        <option v-for="calificacion in calificacionesUnicas" :key="calificacion" :value="calificacion">
          {{ calificacion }}
        </option>
      </select>
    </div>

    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th>Calificación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
          <td>{{ cliente.id }}</td>
          <td>{{ cliente.nombre }}</td>
          <td>{{ cliente.telefono }}</td>
          <td>{{ cliente.direccion }}</td>
          <td>{{ cliente.calificacion }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="editarCliente(cliente)">
              Editar
            </button>
            <button class="btn btn-danger btn-sm" @click="eliminarCliente(cliente.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Cliente -->
    <div
      class="modal fade"
      id="clienteModal"
      tabindex="-1"
      aria-labelledby="clienteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="clienteModalLabel">
              {{ estaEditando ? 'Editar Cliente' : 'Nuevo Cliente' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarCliente">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  id="nombre"
                  v-model="clienteActual.nombre"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input
                  type="text"
                  class="form-control"
                  id="telefono"
                  v-model="clienteActual.telefono"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input
                  type="text"
                  class="form-control"
                  id="direccion"
                  v-model="clienteActual.direccion"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="calificacion" class="form-label">Calificación</label>
                <input
                  type="text"
                  class="form-control"
                  id="calificacion"
                  v-model="clienteActual.calificacion"
                  required
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ estaEditando ? 'Guardar Cambios' : 'Crear Cliente' }}
                </button>
              </div>
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
  name: 'ClientesView',
  data() {
    return {
      clientes: [],
      todosLosClientes: [], // Para almacenar todos los clientes sin filtrar
      clienteActual: {
        id: null,
        nombre: '',
        telefono: '',
        direccion: '',
        calificacion: ''
      },
      estaEditando: false,
      modalCliente: null,
      filtroNombre: '',
      filtroCalificacion: ''
    };
  },
  computed: {
    calificacionesUnicas() {
      const calificaciones = new Set(this.todosLosClientes.map(cli => cli.calificacion));
      return [...calificaciones];
    },
    clientesFiltrados() {
      let filtrados = this.todosLosClientes;

      // Filtrar por nombre
      if (this.filtroNombre) {
        filtrados = filtrados.filter(cliente =>
          cliente.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
        );
      }

      // Filtrar por calificación
      if (this.filtroCalificacion) {
        filtrados = filtrados.filter(cliente => cliente.calificacion === this.filtroCalificacion);
      }

      return filtrados;
    }
  },
  mounted() {
    this.obtenerClientes();
    this.modalCliente = new Modal(document.getElementById('clienteModal'));
  },
  methods: {
    async obtenerClientes() {
      try {
        const response = await axios.get('http://localhost:3000/clientes');
        this.clientes = response.data;
        this.todosLosClientes = response.data; // Almacenar todos los clientes
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    },
    mostrarModalNuevoCliente() {
      this.estaEditando = false;
      this.clienteActual = {
        id: null,
        nombre: '',
        telefono: '',
        direccion: '',
        calificacion: ''
      };
      this.modalCliente.show();
    },
    editarCliente(cliente) {
      this.estaEditando = true;
      this.clienteActual = { ...cliente };
      this.modalCliente.show();
    },
    async guardarCliente() {
      try {
        if (this.estaEditando) {
          await axios.put(
            `http://localhost:3000/clientes/${this.clienteActual.id}`,
            this.clienteActual
          );
        } else {
          await axios.post('http://localhost:3000/clientes', this.clienteActual);
        }
        this.modalCliente.hide();
        this.obtenerClientes(); // Refrescar la lista
      } catch (error) {
        console.error('Error al guardar cliente:', error);
      }
    },
    async eliminarCliente(id) {
      if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
        try {
          await axios.delete(`http://localhost:3000/clientes/${id}`);
          this.obtenerClientes(); // Refrescar la lista
        } catch (error) {
          console.error('Error al eliminar cliente:', error);
        }
      }
    },
    aplicarFiltros() {
      // La propiedad computada `clientesFiltrados` maneja la lógica de filtrado
      // No se necesita una acción directa aquí, solo se vuelve a renderizar en función de los cambios del v-model
    }
  }
};
</script>

<style scoped>
.clientes {
  text-align: center;
  padding: 20px;
}
</style>