import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { CitaService } from '../../services/cita.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { ConsultorioService } from '../../services/consultorio.service';

@Component({
  selector: 'app-cita-reserva',
  templateUrl: './cita-reserva.component.html',
  styleUrls: ['./cita-reserva.component.css']
})

export class CitaReservaComponent implements OnInit {

  /*====================================================
                      LISTAS
  ====================================================*/

  listaPacientes: any[] = [];

  listaEspecialidades: any[] = [];

  listaConsultorios: any[] = [];

  todosLosMedicos: any[] = [];

  medicosFiltrados: any[] = [];

  /*====================================================
                    FORMULARIO
  ====================================================*/

  reserva = {

    pacienteId: null,

    especialidadId: null,

    medicoId: null,

    consultorioId: null,

    fecha: '',

    hora: '',

    motivoConsulta: ''

  };

  /*====================================================
                    MENSAJES
  ====================================================*/

  mensaje = '';

  esError = false;

  /*====================================================
                      LOGIN
  ====================================================*/

  esPacienteLogueado = false;

  nombrePacienteFijo = '';

  /*====================================================
                      MODAL
  ====================================================*/

  mostrarModal = false;

  /*====================================================
                COMPROBANTE
  ====================================================*/

  codigoReserva = '';

  pacienteConfirmado = '';

  medicoConfirmado = '';

  especialidadConfirmada = '';

  consultorioConfirmado = '';

  fechaConfirmada = '';

  fechaFormateada = '';

  horaConfirmada = '';

  /*====================================================
                RESTRICCIONES
  ====================================================*/

  fechaMinima = '';

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

  /*====================================================
                    CONSTRUCTOR
  ====================================================*/

  constructor(

    private http: HttpClient,

    private citaService: CitaService,

    private especialidadService: EspecialidadService,

    private consultorioService: ConsultorioService,

    private router: Router

  ){}

  /*====================================================
                    INICIO
====================================================*/

ngOnInit(): void {

    // Fecha mínima permitida
    this.fechaMinima = new Date().toISOString().split('T')[0];

    // Cargar datos maestros
    this.cargarDatosMaestros();

}

/*====================================================
              CARGAR DATOS
====================================================*/

cargarDatosMaestros() {

    const correoLogueado =
        localStorage.getItem('username');

    this.http.get<any[]>(
        'https://backend-clisuecia-production.up.railway.app/api/usuarios'
    ).subscribe(usuarios => {

        const usuarioActual = usuarios.find(
            u => u.username === correoLogueado
        );

        // ===============================
        // PACIENTE LOGUEADO
        // ===============================

        if (usuarioActual && usuarioActual.rolId === 3) {

            this.esPacienteLogueado = true;

            this.http.get<any[]>(
                'https://backend-clisuecia-production.up.railway.app/api/pacientes'
            ).subscribe(pacientes => {

                const perfil = pacientes.find(
                    p => p.usuarioId === usuarioActual.usuarioId
                );

                if (perfil) {

                    this.reserva.pacienteId =
                        perfil.pacienteId;

                    this.nombrePacienteFijo =
                        `${perfil.nombre} ${perfil.apellido}`;

                }

            });

        }

        // ===============================
        // ADMINISTRADOR
        // ===============================

        else {

            this.esPacienteLogueado = false;

            this.http.get<any[]>(
                'https://backend-clisuecia-production.up.railway.app/api/pacientes'
            ).subscribe(data => {

                this.listaPacientes = data;

            });

        }

        // ===============================
        // DATOS GENERALES
        // ===============================

        this.http.get<any[]>(
            'https://backend-clisuecia-production.up.railway.app/api/medicos'
        ).subscribe(data => {

            this.todosLosMedicos = data;

        });

        this.especialidadService
            .obtenerEspecialidades()
            .subscribe(data => {

                this.listaEspecialidades = data;

            });

        this.consultorioService
            .listarConsultorios()
            .subscribe(data => {

                this.listaConsultorios = data;

            });

    });

}

/*====================================================
          FILTRAR MÉDICOS
====================================================*/

alCambiarEspecialidad() {

    this.medicosFiltrados =
        this.todosLosMedicos.filter(

            medico =>

            medico.especialidadId ===
            Number(this.reserva.especialidadId)

        );

    this.reserva.medicoId = null;

}

/*====================================================
        GENERAR CÓDIGO
====================================================*/

generarCodigoReserva(): string {

    const año = new Date().getFullYear();

    const numero =
        Math.floor(
            100000 + Math.random() * 900000
        );

    return `CS-${año}-${numero}`;

}

/*====================================================
        FORMATEAR FECHA
====================================================*/

formatearFecha(fecha: string): string {

    return new Date(fecha).toLocaleDateString(

        'es-PE',

        {

            weekday: 'long',

            year: 'numeric',

            month: 'long',

            day: 'numeric'

        }

    );

}
/*====================================================
                AGENDAR CITA
====================================================*/

agendar() {

  // ==========================================
  // VALIDAR CAMPOS
  // ==========================================

  if (!this.reserva.fecha || !this.reserva.hora) {

    this.mensaje = "Debe seleccionar una fecha y una hora.";

    this.esError = true;

    return;

  }

  // ==========================================
  // VALIDAR DOMINGO
  // ==========================================

  const fechaSeleccionada = new Date(this.reserva.fecha);

  const dia = fechaSeleccionada.getDay();

  if (dia === 0) {

    this.mensaje =
      "La Clínica Suecia atiende únicamente de lunes a sábado.";

    this.esError = true;

    return;

  }

  // ==========================================
  // VALIDAR SI ES EL MISMO DÍA
  // ==========================================

  const hoy = new Date();

  const hoyTexto = hoy.toISOString().split("T")[0];

  if (this.reserva.fecha === hoyTexto) {

    const minutosActuales =
      hoy.getHours() * 60 +
      hoy.getMinutes();

    const partes =
      this.reserva.hora.split(":");

    const minutosReserva =
      Number(partes[0]) * 60 +
      Number(partes[1]);

    if (minutosReserva <= minutosActuales) {

      this.mensaje =
        "No puede reservar una hora que ya pasó.";

      this.esError = true;

      return;

    }

  }

  // ==========================================
  // VALIDAR HORARIO CLÍNICA
  // ==========================================

  const hora =
    Number(this.reserva.hora.split(":")[0]);

  const minuto =
    Number(this.reserva.hora.split(":")[1]);

  if (

    hora < 8 ||

    hora > 16 ||

    (hora === 16 && minuto > 0)

  ) {

    this.mensaje =
      "Horario permitido: 08:00 AM a 04:00 PM.";

    this.esError = true;

    return;

  }

  // ==========================================
  // DTO PARA SPRING
  // ==========================================

  const paqueteFinal = {

    pacienteId:
      this.reserva.pacienteId,

    medicoId:
      this.reserva.medicoId,

    consultorioId:
      this.reserva.consultorioId,

    fechaHora:
      `${this.reserva.fecha}T${this.reserva.hora}:00`,

    motivoConsulta:
      this.reserva.motivoConsulta

  };

  // ==========================================
  // GUARDAR CITA
  // ==========================================

  this.citaService.agendarCita(paqueteFinal).subscribe({

    next: () => {

      this.esError = false;

      this.mensaje = "";

      // ====================================
      // CÓDIGO DE RESERVA
      // ====================================

      this.codigoReserva =
        this.generarCodigoReserva();

      // ====================================
      // FECHA
      // ====================================

      this.fechaConfirmada =
        this.reserva.fecha;

      this.fechaFormateada =
        this.formatearFecha(
          this.reserva.fecha
        );

      this.horaConfirmada =
        this.reserva.hora;

      // ====================================
      // PACIENTE
      // ====================================

      if (this.esPacienteLogueado) {

        this.pacienteConfirmado =
          this.nombrePacienteFijo;

      } else {

        const paciente =
          this.listaPacientes.find(

            p =>

            p.pacienteId ===
            this.reserva.pacienteId

          );

        this.pacienteConfirmado =
          paciente
            ? `${paciente.nombre} ${paciente.apellido}`
            : "";

      }

      // ====================================
      // MÉDICO
      // ====================================

      const medico =
        this.todosLosMedicos.find(

          m =>

          m.medicoId ===
          this.reserva.medicoId

        );

      this.medicoConfirmado =
        medico
          ? `Dr(a). ${medico.nombre} ${medico.apellido}`
          : "";

      // ====================================
      // ESPECIALIDAD
      // ====================================

      const especialidad =
        this.listaEspecialidades.find(

          e =>

          e.especialidadId ===
          Number(this.reserva.especialidadId)

        );

      this.especialidadConfirmada =
        especialidad
          ? especialidad.nombre
          : "";

      // ====================================
      // CONSULTORIO
      // ====================================

      const consultorio =
        this.listaConsultorios.find(

          c =>

          c.consultorioId ===
          this.reserva.consultorioId

        );

      this.consultorioConfirmado =
        consultorio
          ? `${consultorio.nombreSala} - Piso ${consultorio.piso}`
          : "";

      // ====================================
      // ABRIR COMPROBANTE
      // ====================================

      this.mostrarModal = true;

    },

    error: (err) => {

      this.esError = true;

      this.mensaje =
        err.error ||
        "Ocurrió un error al registrar la cita.";

    }

  });

}


/*====================================================
        DESCARGAR COMPROBANTE PDF
====================================================*/

descargarComprobante() {

  const doc = new jsPDF();

  // ==========================================
  // ENCABEZADO
  // ==========================================

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 210, 35, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CLÍNICA SUECIA", 105, 16, { align: "center" });

  doc.setFontSize(12);
  doc.text("Comprobante Oficial de Reserva de Cita", 105, 25, {
    align: "center"
  });

  // ==========================================
  // CÓDIGO
  // ==========================================

  doc.setTextColor(15, 23, 42);

  doc.setFontSize(13);

  doc.text(`Código de Reserva: ${this.codigoReserva}`, 20, 50);

  // ==========================================
  // TABLA
  // ==========================================

  autoTable(doc, {

    startY: 58,

    theme: "grid",

    head: [["Información", "Detalle"]],

    body: [

      ["Paciente", this.pacienteConfirmado],

      ["Médico", this.medicoConfirmado],

      ["Especialidad", this.especialidadConfirmada],

      ["Consultorio", this.consultorioConfirmado],

      ["Fecha", this.fechaFormateada],

      ["Hora", this.horaConfirmada]

    ],

    headStyles: {

      fillColor: [15, 118, 110],

      halign: "center"

    },

    styles: {

      fontSize: 11,

      cellPadding: 4

    }

  });

  // ==========================================
  // INDICACIONES
  // ==========================================

  let y = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(15);

  doc.setTextColor(180, 90, 0);

  doc.text("Indicaciones Importantes", 20, y);

  y += 10;

  doc.setFontSize(11);

  doc.setTextColor(60);

  doc.text("• Presentarse 15 minutos antes de la cita.", 25, y);

  y += 8;

  doc.text("• La Clínica Suecia brinda una tolerancia máxima de 10 minutos.", 25, y);

  y += 8;

  doc.text("• Si supera el tiempo de tolerancia el médico podrá cancelar la atención.", 25, y);

  y += 8;

  doc.text("• Llevar DNI el día de la consulta.", 25, y);

  y += 8;

  doc.text("• Presentar exámenes médicos si fueron solicitados.", 25, y);

  // ==========================================
  // PIE
  // ==========================================

  y += 20;

  doc.setDrawColor(180);

  doc.line(20, y, 190, y);

  y += 10;

  doc.setFontSize(10);

  doc.setTextColor(120);

  doc.text(

    "Gracias por confiar en Clínica Suecia.",

    105,

    y,

    { align: "center" }

  );

  y += 6;

  doc.text(

    "Este comprobante acredita la reserva de su cita médica.",

    105,

    y,

    { align: "center" }

  );

  y += 6;

  doc.text(

    "www.clinicasuecia.pe",

    105,

    y,

    { align: "center" }

  );

  // ==========================================
  // DESCARGAR
  // ==========================================

  doc.save(`Comprobante_${this.codigoReserva}.pdf`);

}
/*====================================================
            CERRAR MODAL
====================================================*/

cerrarModal() {

    this.mostrarModal = false;

    const rol = Number(localStorage.getItem('rol'));

    if (rol === 3) {

        // Paciente
        this.router.navigate(['/mi-historial']);

    } else if (rol === 2) {

        // Médico
        this.router.navigate(['/agenda-medico']);

    } else {

        // Administrador
        this.router.navigate(['/dashboard']);

    }

}
}