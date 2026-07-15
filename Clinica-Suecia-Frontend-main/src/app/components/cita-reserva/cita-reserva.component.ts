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
  // ===============================
// MODAL DE CONFIRMACIÓN
// ===============================

mostrarModal = false;

fechaConfirmada = '';

horaConfirmada = '';

medicoConfirmado = '';
  // 🚨 MULTI-ROL: Variables para saber si ocultamos el select de pacientes
  esPacienteLogueado: boolean = false;
  nombrePacienteFijo: string = '';

  // ===================================
// RESTRICCIONES DE LA CLÍNICA
// ===================================

// No permite seleccionar días anteriores
fechaMinima: string = "";

// Horarios permitidos (cada 30 minutos)
horariosDisponibles: string[] = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00"
];

  constructor(
    private http: HttpClient,
    private citaService: CitaService,
    private especialidadService: EspecialidadService,
    private consultorioService: ConsultorioService,
    private router: Router
  ) {}

  ngOnInit(): void {

  this.cargarDatosMaestros();

  // Fecha mínima = hoy
  this.fechaMinima = new Date().toISOString().split('T')[0];

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

  // ===================================
  // VALIDAR FECHA Y HORA
  // ===================================

  if (!this.reserva.fecha || !this.reserva.hora) {

    this.mensaje = "Debe seleccionar una fecha y una hora.";

    this.esError = true;

    return;

  }

  // Fecha seleccionada

  const fechaSeleccionada = new Date(this.reserva.fecha);

  // Día de la semana

  const dia = fechaSeleccionada.getDay();

  
// Domingo = 0

if (dia === 0) {

    this.mensaje =
      "La Clínica Suecia atiende de lunes a sábado. Los domingos no hay atención.";

    this.esError = true;

    return;

}

  // ===================================
  // SI ES HOY, VALIDAR HORA
  // ===================================

  const hoy = new Date();

  const fechaHoy = hoy.toISOString().split("T")[0];

  if (this.reserva.fecha === fechaHoy) {

    const horaActual =
      hoy.getHours() * 60 + hoy.getMinutes();

    const partes = this.reserva.hora.split(":");

    const horaReserva =
      Number(partes[0]) * 60 +
      Number(partes[1]);

    if (horaReserva <= horaActual) {

      this.mensaje =
        "No puede reservar una cita en una hora que ya pasó.";

      this.esError = true;

      return;

    }

  }

  // ===================================
  // HORARIO DE LA CLÍNICA
  // ===================================

  const partes = this.reserva.hora.split(":");

  const hora = Number(partes[0]);

  const minuto = Number(partes[1]);

  if (

    hora < 8 ||

    hora > 16 ||

    (hora === 16 && minuto > 0)

) {

    this.mensaje =
      "La Clínica Suecia atiende únicamente entre las 08:00 AM y las 04:00 PM.";

    this.esError = true;

    return;

}

  // ===================================
  // FORMATEAR FECHA
  // ===================================

  const fechaHoraFormateada =
    `${this.reserva.fecha}T${this.reserva.hora}:00`;

  const paqueteFinal = {

    pacienteId: this.reserva.pacienteId,

    medicoId: this.reserva.medicoId,

    consultorioId: this.reserva.consultorioId,

    fechaHora: fechaHoraFormateada,

    motivoConsulta: this.reserva.motivoConsulta

  };

  // ===================================
  // ENVIAR
  // ===================================

  this.citaService.agendarCita(paqueteFinal).subscribe({

   next: () => {

  this.esError = false;

  this.fechaConfirmada = this.reserva.fecha;

  this.horaConfirmada = this.reserva.hora;

  const medico = this.todosLosMedicos.find(
    m => m.medicoId === this.reserva.medicoId
  );

  this.medicoConfirmado = medico
      ? `Dr(a). ${medico.nombre} ${medico.apellido}`
      : "Médico asignado";

  this.mostrarModal = true;

},

    error: (err) => {

      this.mensaje =
        err.error || "Error al reservar la cita.";

      this.esError = true;

    }

  });

}


cerrarModal(){

    this.mostrarModal = false;

    this.router.navigate(['/']);

}
}