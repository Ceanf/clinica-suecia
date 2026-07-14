import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaService } from '../../services/cita.service';

@Component({
  selector: 'app-cita-lista',
  templateUrl: './cita-lista.component.html',
  styleUrls: ['./cita-lista.component.css']
})
export class CitaListaComponent implements OnInit {

  listaCitas: any[] = [];
  
  // Listas maestras para traducir los IDs a Nombres
  listaPacientes: any[] = [];
  listaMedicos: any[] = [];
  listaConsultorios: any[] = [];

  constructor(
    private citaService: CitaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Descargamos los diccionarios (catálogos)
    this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/pacientes').subscribe(p => this.listaPacientes = p);
    this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/medicos').subscribe(m => this.listaMedicos = m);
    this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/consultorios').subscribe(c => this.listaConsultorios = c);

    // 2. Descargamos las citas
    this.citaService.listarTodas().subscribe(data => {
      // Ordenamos las citas para que las más recientes salgan arriba
      this.listaCitas = data.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
    });
  }

  // --- MÉTODOS TRADUCTORES PARA LA TABLA ---

  obtenerPaciente(id: number): string {
    const p = this.listaPacientes.find(x => x.pacienteId === id);
    return p ? `${p.nombre} ${p.apellido}` : 'Cargando...';
  }

  obtenerMedico(id: number): string {
    const m = this.listaMedicos.find(x => x.medicoId === id);
    return m ? `Dr(a). ${m.apellido}` : 'Cargando...';
  }

  obtenerConsultorio(id: number): string {
    const c = this.listaConsultorios.find(x => x.consultorioId === id);
    return c ? `${c.nombreSala} (Piso ${c.piso})` : 'Cargando...';
  }
}
