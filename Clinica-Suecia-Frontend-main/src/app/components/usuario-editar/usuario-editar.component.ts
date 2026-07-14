import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EspecialidadService } from '../../services/especialidad.service'; // ¡Excelente, ya lo tenías!

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css']
})
export class UsuarioEditarComponent implements OnInit {

  usuarioId!: number;
  
  // Objeto base que se rellenará con los datos que mande Java desde Supabase
  usuario: any = {
    username: '',
    password: '', // Se deja vacío para que no pinte nada raro en la caja de texto
    rolId: 1,
    activo: true,
    nombre: '',
    apellido: '',
    dni: '',
    cmp: '',
    especialidadId: null
  };

  mensaje: string = '';
  esError: boolean = false;

  // 🚨 1. NUEVA VARIABLE: Aquí guardaremos la lista dinámica de especialidades
  listaEspecialidades: any[] = []; 

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router,
    private especialidadService: EspecialidadService // 🚨 2. INYECTAMOS EL SERVICIO AQUÍ
  ) {}

  ngOnInit(): void {
    // Jalamos el ID de la URL y lo convertimos a número
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarUsuario();
    this.cargarEspecialidades(); // 🚨 3. LLAMAMOS A LAS ESPECIALIDADES AL ABRIR LA PANTALLA
  }

  // 🚨 4. NUEVO MÉTODO: Jala las opciones reales de Supabase a través de Java
  cargarEspecialidades() {
    this.especialidadService.obtenerEspecialidades().subscribe({
      next: (data) => {
        this.listaEspecialidades = data;
      },
      error: (err) => {
        console.error('Error al cargar especialidades dinámicas', err);
      }
    });
  }

  // 1. CONSULTAR LOS DATOS ACTUALES DEL USUARIO A TRAVÉS DE JAVA
  cargarUsuario() {
    this.http.get(`https://backend-clisuecia-production.up.railway.app/api/usuarios/${this.usuarioId}`).subscribe({
      next: (res) => {
        this.usuario = res;
        // Reseteamos el campo password en el formulario por seguridad (el hash se queda a salvo en Java)
        this.usuario.password = ''; 
      },
      error: () => {
        this.mensaje = "Error al cargar los datos del usuario en el formulario.";
        this.esError = true;
      }
    });
  }

  // 2. MANDAR LAS MODIFICACIONES DE REGRESO AL ENDPOINT PUT DE JAVA
  guardarCambios() {

    // Aseguramos que el ID viaje dentro del objeto
    this.usuario.usuarioId = this.usuarioId;

    this.http.put(`https://backend-clisuecia-production.up.railway.app/api/usuarios/${this.usuarioId}`, this.usuario, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.mensaje = res; // "¡Usuario actualizado con éxito!"
        this.esError = false;
        
        // Esperamos 1.5 segundos para que el administrador lea el mensaje de éxito y lo redirigimos a la tabla
        setTimeout(() => {
          this.router.navigate(['/usuarios']);
        }, 1500);
      },
      error: (err) => {
        this.mensaje = "Error al intentar actualizar el usuario: " + err.error;
        this.esError = true;
      }
    });
  }
}