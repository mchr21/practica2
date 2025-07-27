<template>
  <div class="container mt-4">
    <h1 class="mb-4">Empleados</h1>

    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-primary" @click="mostrarModalNuevoEmpleado">
        Nuevo Empleado
      </button>
      <input
        type="text"
        class="form-control w-25"
        placeholder="Buscar por nombre..."
        v-model="filtroNombre"
        @input="aplicarFiltros"
      />
      <select class="form-select w-25" v-model="filtroRol" @change="aplicarFiltros">
        <option value="">Todos los Roles</option>
        <option v-for="rol in rolesUnicos" :key="rol" :value="rol">
          {{ rol }}
        </option>
      </select>
    </div>

    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Usuario</th>
          <th>Contraseña</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empleado in empleadosFiltrados" :key="empleado.id">
          <td>{{ empleado.id }}</td>
          <td>{{ empleado.nombre }}</td>
          <td>{{ empleado.usuario }}</td>
          <td>••••••••</td>
          <td>{{ empleado.rol }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="editarEmpleado(empleado)">
              Editar
            </button>
            <button class="btn btn-danger btn-sm" @click="eliminarEmpleado(empleado.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Empleado -->
    <div
      class="modal fade"
      id="empleadoModal"
      tabindex="-1"
      aria-labelledby="empleadoModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="empleadoModalLabel">
              {{ estaEditando ? 'Editar Empleado' : 'Nuevo Empleado' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarEmpleado">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  id="nombre"
                  v-model="empleadoActual.nombre"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="usuario" class="form-label">Usuario</label>
                <input
                  type="text"
                  class="form-control"
                  id="usuario"
                  v-model="empleadoActual.usuario"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="empleadoActual.password"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="rol" class="form-label">Rol</label>
                <input
                  type="text"
                  class="form-control"
                  id="rol"
                  v-model="empleadoActual.rol"
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
                  {{ estaEditando ? 'Guardar Cambios' : 'Crear Empleado' }}
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
  name: 'EmpleadosView',
  data() {
    return {
      empleados: [],
      todosLosEmpleados: [],
      empleadoActual: {
        id: null,
        nombre: '',
        usuario: '',
        password: '',
        rol: ''
      },
      estaEditando: false,
      modalEmpleado: null,
      filtroNombre: '',
      filtroRol: ''
    };
  },
  computed: {
    rolesUnicos() {
      const roles = new Set(this.todosLosEmpleados.map(emp => emp.rol));
      return [...roles];
    },
    empleadosFiltrados() {
      let filtrados = this.todosLosEmpleados;

      if (this.filtroNombre) {
        filtrados = filtrados.filter(empleado =>
          empleado.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
        );
      }

      if (this.filtroRol) {
        filtrados = filtrados.filter(empleado => empleado.rol === this.filtroRol);
      }

      return filtrados;
    }
  },
  mounted() {
    this.obtenerEmpleados();
    this.modalEmpleado = new Modal(document.getElementById('empleadoModal'));
  },
  methods: {
    async obtenerEmpleados() {
      try {
        const response = await axios.get('http://localhost:3000/empleados');
        this.empleados = response.data;
        this.todosLosEmpleados = response.data;
      } catch (error) {
        console.error('Error al obtener empleados:', error);
      }
    },
    mostrarModalNuevoEmpleado() {
      this.estaEditando = false;
      this.empleadoActual = {
        id: null,
        nombre: '',
        usuario: '',
        password: '',
        rol: ''
      };
      this.modalEmpleado.show();
    },
    editarEmpleado(empleado) {
      this.estaEditando = true;
      this.empleadoActual = { ...empleado };
      this.modalEmpleado.show();
    },
    async guardarEmpleado() {
      try {
        if (this.estaEditando) {
          await axios.put(
            `http://localhost:3000/empleados/${this.empleadoActual.id}`,
            this.empleadoActual
          );
        } else {
          await axios.post('http://localhost:3000/empleados', this.empleadoActual);
        }
        this.modalEmpleado.hide();
        this.obtenerEmpleados();
      } catch (error) {
        console.error('Error al guardar empleado:', error);
      }
    },
    async eliminarEmpleado(id) {
      if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
        try {
          await axios.delete(`http://localhost:3000/empleados/${id}`);
          this.obtenerEmpleados();
        } catch (error) {
          console.error('Error al eliminar empleado:', error);
        }
      }
    },
    aplicarFiltros() {
      // La propiedad computada empleadosFiltrados maneja la lógica
    }
  }
};
</script>

<style scoped>
.empleados {
  text-align: center;
  padding: 20px;
}
</style>