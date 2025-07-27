<template>
  <div class="container-fluid mt-3">
    <h1 class="mb-4">Alquileres</h1>

    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-success" @click="mostrarModalNuevoAlquiler">
        Nuevo Alquiler
      </button>
      <div class="d-flex">
        <div class="me-2">
          <label for="filtroPelicula" class="form-label visually-hidden">Filtrar por Película</label>
          <select id="filtroPelicula" class="form-select" v-model="filtroPelicula" @change="aplicarFiltros">
            <option value="">Todas las Películas</option>
            <option v-for="pelicula in peliculas" :key="pelicula.id" :value="pelicula.id">
              {{ pelicula.titulo }}
            </option>
          </select>
        </div>
        <div class="me-2">
          <label for="filtroCliente" class="form-label visually-hidden">Filtrar por Cliente</label>
          <select id="filtroCliente" class="form-select" v-model="filtroCliente" @change="aplicarFiltros">
            <option value="">Todos los Clientes</option>
            <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
              {{ cliente.nombre }}
            </option>
          </select>
        </div>
        <div class="me-2">
          <label for="filtroEmpleado" class="form-label visually-hidden">Filtrar por Empleado</label>
          <select id="filtroEmpleado" class="form-select" v-model="filtroEmpleado" @change="aplicarFiltros">
            <option value="">Todos los Empleados</option>
            <option v-for="empleado in empleados" :key="empleado.id" :value="empleado.id">
              {{ empleado.nombre }}
            </option>
          </select>
        </div>
        <div>
          <label for="buscarAlquiler" class="form-label visually-hidden">Buscar por Fecha de Alquiler</label>
          <input
            type="text"
            class="form-control"
            id="buscarAlquiler"
            placeholder="Buscar por Fecha de Alquiler"
            v-model="busquedaFechaAlquiler"
            @input="aplicarFiltros"
          />
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Película</th>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Fecha Alquiler</th>
            <th>Fecha Devolución</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alquiler in alquileresFiltrados" :key="alquiler.id">
            <td>{{ alquiler.id }}</td>
            <td>{{ obtenerTituloPelicula(alquiler.idpelicula) }}</td>
            <td>{{ obtenerNombreCliente(alquiler.idcliente) }}</td>
            <td>{{ obtenerNombreEmpleado(alquiler.idempleado) }}</td>
            <td>{{ alquiler.fecha_alquiler }}</td>
            <td>{{ alquiler.fecha_devolucion }}</td>
            <td>{{ alquiler.monto }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" @click="editarAlquiler(alquiler)">
                Editar
              </button>
              <button class="btn btn-danger btn-sm" @click="eliminarAlquiler(alquiler.id)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para Nuevo/Editar Alquiler -->
    <div
      class="modal fade"
      id="alquilerModal"
      tabindex="-1"
      aria-labelledby="alquilerModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="alquilerModalLabel">
              {{ editando ? 'Editar Alquiler' : 'Nuevo Alquiler' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarAlquiler">
              <div class="mb-3">
                <label for="idpelicula" class="form-label">Película</label>
                <select id="idpelicula" class="form-select" v-model="alquilerActual.idpelicula" required>
                  <option value="">Seleccione una película</option>
                  <option v-for="pelicula in peliculas" :key="pelicula.id" :value="pelicula.id">
                    {{ pelicula.titulo }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="idcliente" class="form-label">Cliente</label>
                <select id="idcliente" class="form-select" v-model="alquilerActual.idcliente" required>
                  <option value="">Seleccione un cliente</option>
                  <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                    {{ cliente.nombre }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="idempleado" class="form-label">Empleado</label>
                <select id="idempleado" class="form-select" v-model="alquilerActual.idempleado" required>
                  <option value="">Seleccione un empleado</option>
                  <option v-for="empleado in empleados" :key="empleado.id" :value="empleado.id">
                    {{ empleado.nombre }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="fecha_alquiler" class="form-label">Fecha de Alquiler</label>
                <input
                  type="date"
                  class="form-control"
                  id="fecha_alquiler"
                  v-model="alquilerActual.fecha_alquiler"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="fecha_devolucion" class="form-label">Fecha de Devolución</label>
                <input
                  type="date"
                  class="form-control"
                  id="fecha_devolucion"
                  v-model="alquilerActual.fecha_devolucion"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="monto" class="form-label">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  id="monto"
                  v-model="alquilerActual.monto"
                  required
                />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Cerrar
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ editando ? 'Guardar Cambios' : 'Crear Alquiler' }}
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
  name: 'AlquilerView',
  data() {
    return {
      alquileres: [],
      todosLosAlquileres: [],
      peliculas: [],
      clientes: [],
      empleados: [],
      alquilerActual: {
        id: null,
        idpelicula: '',
        idcliente: '',
        idempleado: '',
        fecha_alquiler: '',
        fecha_devolucion: '',
        monto: 0,
      },
      editando: false,
      alquilerModal: null,
      filtroPelicula: '',
      filtroCliente: '',
      filtroEmpleado: '',
      busquedaFechaAlquiler: '',
    };
  },
  computed: {
    alquileresFiltrados() {
      let alquileresFiltrados = this.todosLosAlquileres;

      if (this.filtroPelicula) {
        alquileresFiltrados = alquileresFiltrados.filter(
          (alquiler) => alquiler.idpelicula == this.filtroPelicula
        );
      }

      if (this.filtroCliente) {
        alquileresFiltrados = alquileresFiltrados.filter(
          (alquiler) => alquiler.idcliente == this.filtroCliente
        );
      }

      if (this.filtroEmpleado) {
        alquileresFiltrados = alquileresFiltrados.filter(
          (alquiler) => alquiler.idempleado == this.filtroEmpleado
        );
      }

      if (this.busquedaFechaAlquiler) {
        const busqueda = this.busquedaFechaAlquiler.toLowerCase();
        alquileresFiltrados = alquileresFiltrados.filter((alquiler) =>
          alquiler.fecha_alquiler.toLowerCase().includes(busqueda)
        );
      }

      return alquileresFiltrados;
    },
  },
  mounted() {
    this.alquilerModal = new Modal(document.getElementById('alquilerModal'));
    this.obtenerAlquileres();
    this.obtenerPeliculas();
    this.obtenerClientes();
    this.obtenerEmpleados();
  },
  methods: {
    async obtenerAlquileres() {
      try {
        const response = await axios.get('http://localhost:3000/alquileres');
        this.alquileres = response.data;
        this.todosLosAlquileres = response.data;
      } catch (error) {
        console.error('Error al obtener alquileres:', error);
      }
    },
    async obtenerPeliculas() {
      try {
        const response = await axios.get('http://localhost:3000/peliculas');
        this.peliculas = response.data;
      } catch (error) {
        console.error('Error al obtener películas:', error);
      }
    },
    async obtenerClientes() {
      try {
        const response = await axios.get('http://localhost:3000/clientes');
        this.clientes = response.data;
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    },
    async obtenerEmpleados() {
      try {
        const response = await axios.get('http://localhost:3000/empleados');
        this.empleados = response.data;
      } catch (error) {
        console.error('Error al obtener empleados:', error);
      }
    },
    obtenerTituloPelicula(id) {
      const pelicula = this.peliculas.find((p) => p.id === id);
      return pelicula ? pelicula.titulo : 'Desconocida';
    },
    obtenerNombreCliente(id) {
      const cliente = this.clientes.find((c) => c.id === id);
      return cliente ? cliente.nombre : 'Desconocido';
    },
    obtenerNombreEmpleado(id) {
      const empleado = this.empleados.find((e) => e.id === id);
      return empleado ? empleado.usuario : 'Desconocido';
    },
    mostrarModalNuevoAlquiler() {
      this.editando = false;
      this.alquilerActual = {
        id: null,
        idpelicula: '',
        idcliente: '',
        idempleado: '',
        fecha_alquiler: '',
        fecha_devolucion: '',
        monto: 0,
      };
      this.alquilerModal.show();
    },
    editarAlquiler(alquiler) {
      this.editando = true;
      this.alquilerActual = { ...alquiler };
      this.alquilerModal.show();
    },
    async guardarAlquiler() {
      try {
        if (this.editando) {
          await axios.put(
            `http://localhost:3000/alquileres/${this.alquilerActual.id}`,
            this.alquilerActual
          );
        } else {
          await axios.post('http://localhost:3000/alquileres', this.alquilerActual);
        }
        this.alquilerModal.hide();
        this.obtenerAlquileres();
      } catch (error) {
        console.error('Error al guardar alquiler:', error);
      }
    },
    async eliminarAlquiler(id) {
      if (confirm('¿Está seguro de que desea eliminar este alquiler?')) {
        try {
          await axios.delete(`http://localhost:3000/alquileres/${id}`);
          this.obtenerAlquileres();
        } catch (error) {
          console.error('Error al eliminar alquiler:', error);
        }
      }
    },
    aplicarFiltros() {
      // La lógica de filtrado se maneja automáticamente por la propiedad computada `alquileresFiltrados`
      // No se necesita lógica adicional aquí, solo se actualizan los v-model de los filtros.
    },
  },
};
</script>

<style scoped>

</style>