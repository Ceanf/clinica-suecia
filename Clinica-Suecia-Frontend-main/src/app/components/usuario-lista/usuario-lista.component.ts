import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})
export class UsuarioListaComponent implements OnInit {

  usuarios: any[] = [];
  mensaje: string = '';
  esError: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // 1. LEER TODOS LOS USUARIOS DESDE JAVA
  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe({
      next: (res) => {
        this.usuarios = res;
      },
      error: () => {
        this.mensaje = "No se pudieron cargar los usuarios.";
        this.esError = true;
      }
    });
  }

  // 2. BOTÓN INTELIGENTE: BAJA LÓGICA (Activar / Desactivar)
  alternarEstado(usuario: any) {
    // Invertimos el estado actual
    const nuevoEstado = !usuario.activo;
    
    // Clonamos el usuario modificando solo el campo activo
    const usuarioModificado = { ...usuario, activo: nuevoEstado };

    // Enviamos el cambio al método PUT del backend
    this.http.put(`http://localhost:8080/api/usuarios/${usuario.usuarioId}`, usuarioModificado, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.mensaje = `Estado de ${usuario.username} actualizado con éxito.`;
        this.esError = false;
        this.cargarUsuarios(); // Recargamos la tabla para ver el cambio de color
      },
      error: (err) => {
        this.mensaje = "Error al cambiar el estado: " + err.error;
        this.esError = true;
      }
    });
  }

  // 3. TRADUCTOR DE ROLES
  obtenerNombreRol(rolId: number): string {
    if (rolId === 1) return 'Administrador';
    if (rolId === 2) return 'Médico';
    if (rolId === 3) return 'Paciente';
    return 'Desconocido';
  }

  // 4. REDIRECCIÓN AL FORMULARIO DE EDICIÓN
  irAEditar(id: number) {
    this.router.navigate([`/editar/${id}`]);
  }
}
