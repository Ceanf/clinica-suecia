import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaService } from '../../services/cita.service';

@Component({
  selector: 'app-agenda-medico',
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.css']
})
export class AgendaMedicoComponent implements OnInit {

  listaPacientes: any[] = [];
  citasDelMedico: any[] = [];

  // =========================
// Catálogo de Enfermedades
// =========================
listaEnfermedades: any[] = [];

tratamientosSugeridos: any[] = [];

enfermedadSeleccionada: number | null = null;
  
  medicoSeleccionadoId: number | null = null;
  nombreMedicoActual: string = ''; // Guardaremos el nombre para mostrarlo en pantalla
  
  // Variables para el panel de atención
  citaEnAtencion: any = null;
  // Le ponemos ": any" para decirle a TypeScript que sea flexible, 
  // y le agregamos el arreglo vacío desde el principio.
  datosAtencion: any = { 
    diagnostico: '', 
    observaciones: '',
    recetas: [] 
  };
  historialBase: any = { alergias: '', antecedentesFamiliares: '', grupoSanguineo: '' };
  mensajeExito: string = '';

  constructor(private http: HttpClient, private citaService: CitaService) { }

  ngOnInit(): void {

    this.cargarEnfermedades();
    // 1. Cargamos pacientes para el traductor
    this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/pacientes').subscribe(data => this.listaPacientes = data);

    // 2. MAGIA DE SESIÓN: Obtenemos el correo logueado (Asegúrate de que 'username' sea la llave correcta en tu localStorage)
    const correoLogueado = localStorage.getItem('username');

    if (correoLogueado) {
      // 3. Buscamos el usuario asociado a ese correo
      this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/usuarios').subscribe(usuarios => {
        const usuario = usuarios.find(u => u.username === correoLogueado);

        if (usuario) {
          // 4. Buscamos el perfil de médico de ese usuario
          this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/medicos').subscribe(medicos => {
            const medico = medicos.find(m => m.usuarioId === usuario.usuarioId);
            
            if (medico) {
              this.medicoSeleccionadoId = medico.medicoId;
              this.nombreMedicoActual = `Dr(a). ${medico.apellido}, ${medico.nombre}`;
              this.cargarAgenda(); // Disparamos la búsqueda de citas automáticamente
            }
          });
        }
      });
    }
  }

  cargarAgenda() {
    if (this.medicoSeleccionadoId) {
      this.citaService.listarPorMedico(this.medicoSeleccionadoId).subscribe(data => {
        this.citasDelMedico = data.sort((a, b) => {
          if (a.estado === 'Pendiente' && b.estado !== 'Pendiente') return -1;
          if (a.estado !== 'Pendiente' && b.estado === 'Pendiente') return 1;
          return 0;
        });
        this.cerrarPanel();
      });
    }
  }

  cargarEnfermedades() {

  this.http.get<any[]>(
    'https://backend-clisuecia-production.up.railway.app/api/catalogo/enfermedades'
  ).subscribe({

    next: (data) => {

      this.listaEnfermedades = data;

    },

    error: (err) => {

      console.error("Error cargando enfermedades", err);

    }

  });

}


cargarTratamientos() {

  if (!this.enfermedadSeleccionada) {
    this.tratamientosSugeridos = [];
    this.datosAtencion.recetas = [];
    return;
  }

  this.http.get<any[]>(
    `https://backend-clisuecia-production.up.railway.app/api/catalogo/enfermedades/${this.enfermedadSeleccionada}/tratamientos`
  ).subscribe({

    next: (data) => {

      this.tratamientosSugeridos = data;

      this.datosAtencion.recetas = data.map(t => ({

        medicamento: t.medicamento,

        dosis: t.dosis,

        instrucciones:
          `${t.frecuencia} - ${t.duracionDias} días`

      }));

    },

    error: (err) => {

      console.error("Error cargando tratamientos", err);

    }

  });

}
  obtenerNombrePaciente(id: number): string {
  // 1. Si la lista de pacientes aún no ha cargado desde el backend, avisamos.
  if (!this.listaPacientes || this.listaPacientes.length === 0) {
    return 'Cargando...';
  }

  // 2. Buscamos el paciente cubriendo los 3 nombres más comunes que Spring Boot le da al ID al convertirlo a JSON.
  const p = this.listaPacientes.find(x => 
    x.pacienteId == id
  );
  
  return p ? `${p.nombre} ${p.apellido}` : 'Desconocido';
}

  // 🚨 ACTUALIZADO: Al hacer clic en "Atender", preparamos todo
  iniciarAtencion(cita: any) {
    this.citaEnAtencion = cita;
    
    // 🚨 NUEVO: Agregamos el arreglo "recetas" vacío
    this.datosAtencion = { 
      diagnostico: '', 
      observaciones: '',
      recetas: [] // Aquí guardaremos las medicinas dinámicamente
    };
    
    this.mensajeExito = '';

    // Traemos la ficha del paciente
    this.http.get<any>(`https://backend-clisuecia-production.up.railway.app/api/historial/paciente/${cita.pacienteId}`).subscribe(res => {
      this.historialBase = res;
    });
  }

  // --- 🚨 NUEVOS MÉTODOS PARA LA RECETA DINÁMICA ---
  
  agregarMedicamento() {
    // Empuja una nueva pastilla "en blanco" a la lista
    this.datosAtencion.recetas.push({ medicamento: '', dosis: '', instrucciones: '' });
  }

  eliminarMedicamento(index: number) {
    // Borra la pastilla de la lista según su posición (index)
    this.datosAtencion.recetas.splice(index, 1);
  }

  cerrarPanel() {
    this.citaEnAtencion = null;
  }

 guardarAtencion() {

    // Buscar la enfermedad seleccionada
    const enfermedad = this.listaEnfermedades.find(
        e => e.enfermedadId === this.enfermedadSeleccionada
    );

    if (enfermedad) {
        this.datosAtencion.diagnostico = enfermedad.nombre;
    }

    // Validaciones
    if (!this.enfermedadSeleccionada) {
        alert("Seleccione una enfermedad.");
        return;
    }

    if (!this.datosAtencion.observaciones) {
        alert("Debe ingresar las observaciones.");
        return;
    }

    // Actualizar historial clínico
    this.http.put(
        `https://backend-clisuecia-production.up.railway.app/api/historial/paciente/${this.citaEnAtencion.pacienteId}`,
        this.historialBase
    ).subscribe({
        next: () => {

            // Guardar la atención
            this.citaService.atenderCita(
                this.citaEnAtencion.citaId,
                this.datosAtencion
            ).subscribe({

                next: () => {
                    this.mensajeExito =
                        "¡Consulta finalizada y ficha médica actualizada con éxito!";
                    this.cargarAgenda();
                },

                error: (err) => {
                    alert("Error al guardar la cita: " + err.error);
                }

            });

        },

        error: () => {
            alert("Error al actualizar la ficha base.");
        }

    });

}

  // --- NUEVA REGLA: ¿Ya es la hora de la cita? ---
  puedeAtender(fechaHoraCita: string): boolean {
    const horaActual = new Date(); // La hora exacta en este segundo
    const horaCita = new Date(fechaHoraCita); // La hora programada
    
    // Retorna TRUE si la hora actual ya superó o es igual a la hora de la cita
    return horaActual >= horaCita; 
  }

  // Ejecuta el botón de Inasistencia
  marcarInasistencia(citaId: number) {
    if (confirm("¿Estás seguro de marcar a este paciente como 'No Asistió'? Esta acción cancelará la cita.")) {
      this.citaService.marcarInasistencia(citaId).subscribe({
        next: () => {
          alert("Se registró la inasistencia correctamente.");
          this.cargarAgenda(); // Recargamos para ver el cambio de color
        },
        error: (err) => alert("Error: " + err.error)
      });
    }
  }
}
