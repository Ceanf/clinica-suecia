import { Component, OnInit } from '@angular/core'; // 🚨 1. Importamos OnInit
import { HttpClient } from '@angular/common/http';
import { EspecialidadService } from '../../services/especialidad.service'; // 🚨 2. Importamos el servicio

@Component({
  selector: 'app-registro-medico',
  templateUrl: './registro-medico.component.html',
  styleUrls: ['./registro-medico.component.css']
})
export class RegistroMedicoComponent implements OnInit { // 🚨 3. Agregamos "implements OnInit"
  
  // CAMBIAMOS 'email' POR 'username' PARA QUE HABLE EL MISMO IDIOMA QUE JAVA
  medico = {
    nombre: '',
    apellido: '',
    username: '', 
    password: '',
    dni: '',
    cmp: '',
    especialidadId: null
  };

  rolSeleccionado: number = 1;
  mensaje: string = '';
  esError: boolean = false;

  // 🚨 4. Variable para guardar la lista que viene de Supabase
  listaEspecialidades: any[] = []; 

  // 🚨 5. Inyectamos tu nuevo EspecialidadService aquí
  constructor(private http: HttpClient, private especialidadService: EspecialidadService) {}

  // 🚨 6. Este método se ejecuta automáticamente apenas entras a la pantalla
  ngOnInit(): void {
    this.especialidadService.obtenerEspecialidades().subscribe({
      next: (data) => {
        this.listaEspecialidades = data; // Guardamos las especialidades en la variable
      },
      error: (err) => {
        console.error('Error al cargar especialidades', err);
      }
    });
  }

  registrar() {
    const url = this.rolSeleccionado == 1 
      ? 'http://localhost:8080/api/registrar' 
      : 'http://localhost:8080/api/registrar-medico';

    this.http.post(url, this.medico, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.mensaje = res;
        this.esError = false;
        this.limpiarFormulario();
      },
      error: (err) => {
        this.mensaje = "Error al registrar: " + err.error;
        this.esError = true;
      }
    });
  }

  limpiarFormulario() {
    this.medico = { nombre: '', apellido: '', username: '', password: '', dni: '', cmp: '', especialidadId: null };
  }
}