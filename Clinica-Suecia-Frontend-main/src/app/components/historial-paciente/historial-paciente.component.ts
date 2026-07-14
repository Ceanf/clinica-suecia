import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaService } from '../../services/cita.service';

@Component({
  selector: 'app-historial-paciente',
  templateUrl: './historial-paciente.component.html',
  styleUrls: ['./historial-paciente.component.css']
})
export class HistorialPacienteComponent implements OnInit {

  listaMedicos: any[] = [];
  listaConsultorios: any[] = [];
  misCitas: any[] = [];
  miFichaBase: any = null;
  
  nombrePacienteActual: string = '';

  constructor(private http: HttpClient, private citaService: CitaService) { }

  ngOnInit(): void {
    // 1. Cargamos catálogos para traducir los IDs a nombres legibles
    this.http.get<any[]>('http://localhost:8080/api/medicos').subscribe(data => this.listaMedicos = data);
    this.http.get<any[]>('http://localhost:8080/api/consultorios').subscribe(data => this.listaConsultorios = data);

    // 2. Buscamos quién inició sesión
    const correoLogueado = localStorage.getItem('username');

    if (correoLogueado) {
      this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe(usuarios => {
        const usuario = usuarios.find(u => u.username === correoLogueado);

        if (usuario) {
          this.http.get<any[]>('http://localhost:8080/api/pacientes').subscribe(pacientes => {
            const paciente = pacientes.find(p => p.usuarioId === usuario.usuarioId);
            
            if (paciente) {
              this.nombrePacienteActual = `${paciente.nombre} ${paciente.apellido}`;
              this.cargarMiHistorial(paciente.pacienteId);
            }
          });
        }
      });
    }
  }

  cargarMiHistorial(pacienteId: number) {
    // 1. Traemos la lista de citas (recetas y diagnósticos)
    this.citaService.listarPorPaciente(pacienteId).subscribe(data => {
      this.misCitas = data.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
    });

    // 2. 🚨 NUEVO: Traemos la ficha clínica permanente (Alergias, Sangre)
    this.http.get<any>(`http://localhost:8080/api/historial/paciente/${pacienteId}`).subscribe(res => {
      this.miFichaBase = res;
    });
  }

  obtenerMedico(id: number): string {
    const m = this.listaMedicos.find(x => x.medicoId === id);
    return m ? `Dr(a). ${m.apellido}` : 'Desconocido';
  }

  obtenerConsultorio(id: number): string {
    const c = this.listaConsultorios.find(x => x.consultorioId === id);
    return c ? `${c.nombreSala} (Piso ${c.piso})` : 'Desconocido';
  }
}
