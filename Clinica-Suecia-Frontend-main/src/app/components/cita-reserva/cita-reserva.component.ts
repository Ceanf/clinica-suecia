import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { ConsultorioService } from '../../services/consultorio.service';

@Component({
  selector: 'app-cita-reserva',
  templateUrl: './cita-reserva.component.html',
  styleUrls: ['./cita-reserva.component.css']
})
export class CitaReservaComponent implements OnInit {

  // 1. LAS "DESPENSAS" DE DATOS
  listaPacientes: any[] = [];
  listaEspecialidades: any[] = [];
  listaConsultorios: any[] = [];
  
  todosLosMedicos: any[] = []; 
  medicosFiltrados: any[] = []; 

  // 2. EL MOLDE DEL FORMULARIO
  reserva: any = {
    pacienteId: null,
    especialidadId: null, // Solo sirve para filtrar en el frontend, no viaja a Java
    medicoId: null,
    consultorioId: null,
    fecha: '',
    hora: '',
    motivoConsulta: ''
  };

  mensaje: string = '';
  esError: boolean = false;
  
  // 🚨 MULTI-ROL: Variables para saber si ocultamos el select de pacientes
  esPacienteLogueado: boolean = false;
  nombrePacienteFijo: string = '';

  constructor(
    private http: HttpClient,
    private citaService: CitaService,
    private especialidadService: EspecialidadService,
    private consultorioService: ConsultorioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosMaestros();
  }

  // 3. CARGAMOS DATOS SEGÚN EL ROL (El componente camaleón)
  cargarDatosMaestros() {
    const correoLogueado = localStorage.getItem('username');

    this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/usuarios').subscribe(usuarios => {
      const usuarioActual = usuarios.find(u => u.username === correoLogueado);

      // 🚨 ESCENARIO A: SI EL QUE INICIÓ SESIÓN ES PACIENTE (Rol 3)
      if (usuarioActual && usuarioActual.rolId === 3) {
        this.esPacienteLogueado = true;
        this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/pacientes').subscribe(pacientes => {
          const miPerfil = pacientes.find(p => p.usuarioId === usuarioActual.usuarioId);
          if (miPerfil) {
            // Autocompletamos su ID en el formulario y guardamos su nombre para la alerta azul
            this.reserva.pacienteId = miPerfil.pacienteId;
            this.nombrePacienteFijo = `${miPerfil.nombre} ${miPerfil.apellido}`;
          }
        });
      } 
      // 🚨 ESCENARIO B: SI ES ADMINISTRADOR O RECEPCIONISTA (Rol 1 u otro)
      else {
        this.esPacienteLogueado = false;
        // Solo ellos necesitan descargar toda la lista de pacientes para el menú desplegable
        this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/pacientes').subscribe(data => {
          this.listaPacientes = data;
        });
      }

      // 🚨 DATOS COMUNES: Esto se carga sin importar quién inició sesión
      this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/medicos').subscribe(data => this.todosLosMedicos = data);
      this.especialidadService.obtenerEspecialidades().subscribe(data => this.listaEspecialidades = data);
      this.consultorioService.listarConsultorios().subscribe(data => this.listaConsultorios = data);
    });
  }

  // 4. MAGIA REACTIVA: Filtra los doctores cuando eliges Cardiología, Pediatría, etc.
  alCambiarEspecialidad() {
    this.medicosFiltrados = this.todosLosMedicos.filter(
      medico => medico.especialidadId === Number(this.reserva.especialidadId)
    );
    // Reseteamos el médico elegido por si había seleccionado uno de otra especialidad
    this.reserva.medicoId = null; 
  }

  // 5. ENVIAR A JAVA
  agendar() {
    // Validamos que haya seleccionado fecha y hora
    if (!this.reserva.fecha || !this.reserva.hora) {
      this.mensaje = "Debe seleccionar una fecha y una hora.";
      this.esError = true;
      return;
    }

    // Unimos la fecha y la hora con una "T" para crear un LocalDateTime compatible con Java
    const fechaHoraFormateada = `${this.reserva.fecha}T${this.reserva.hora}:00`;

    // Armamos el paquete final idéntico al RegistroCitaDTO de Java
    const paqueteFinal = {
      pacienteId: this.reserva.pacienteId,
      medicoId: this.reserva.medicoId,
      consultorioId: this.reserva.consultorioId,
      fechaHora: fechaHoraFormateada,
      motivoConsulta: this.reserva.motivoConsulta
    };

    // Mandamos el paquete a Java
    this.citaService.agendarCita(paqueteFinal).subscribe({
      next: () => {
        this.mensaje = "¡Cita reservada con éxito! El sistema ha bloqueado este horario.";
        this.esError = false;
        
        setTimeout(() => {
          this.router.navigate(['/']); // Redirigimos al inicio después de 2.5 segundos
        }, 2500);
      },
      error: (err) => {
        // Atrapamos la alerta roja si Java detecta un choque de horarios (Regla de 30 minutos)
        this.mensaje = err.error || "Error al intentar agendar la cita.";
        this.esError = true;
      }
    });
  }
}