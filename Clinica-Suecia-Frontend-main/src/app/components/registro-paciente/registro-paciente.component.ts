import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css']
})
export class RegistroPacienteComponent implements OnInit {
  
  paciente: any = {
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    fechaNacimiento: '',
    rolId: 3,
    activo: true
  };

  usuarioId!: number;
  esEdicion: boolean = false; // Flag para activar el modo espejo
  mensaje: string = '';
  esError: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔍 Detectamos si la URL trae un ID (Ej: /usuarios/editar-paciente/12)
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.esEdicion = true;
      this.usuarioId = +idParam;
      this.cargarDatosPaciente();
    }
  }

  cargarDatosPaciente() {
    this.http.get(`https://backend-clisuecia-production.up.railway.app/api/usuarios/${this.usuarioId}`).subscribe({
      next: (res: any) => {
        this.paciente = res;
        // La contraseña no se descarga por seguridad, se inicializa vacía para el input opcional
        this.paciente.password = ''; 
      },
      error: () => {
        this.mensaje = 'Error al cargar los datos del paciente.';
        this.esError = true;
      }
    });
  }

  guardar() {
    if (this.esEdicion) {
      // 📝 MODO EDICIÓN (Manda PUT al backend)
      this.http.put(`https://backend-clisuecia-production.up.railway.app/api/usuarios/${this.usuarioId}`, this.paciente, { responseType: 'text' }).subscribe({
        next: (res) => {
          this.mensaje = "¡Paciente actualizado con éxito!";
          this.esError = false;
          setTimeout(() => this.router.navigate(['/usuarios']), 1500);
        },
        error: (err) => {
          this.mensaje = err.error || "Error al actualizar.";
          this.esError = true;
        }
      });
    } else {
      // ➕ MODO REGISTRO ORIGINAL (Manda POST al backend)
      this.http.post('https://backend-clisuecia-production.up.railway.app/api/registrar-paciente', this.paciente, { responseType: 'text' }).subscribe({
        next: (res) => {
          this.mensaje = "¡Cuenta creada con éxito! Redireccionando...";
          this.esError = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.mensaje = err.error || "Error en el registro.";
          this.esError = true;
        }
      });
    }
  }
}