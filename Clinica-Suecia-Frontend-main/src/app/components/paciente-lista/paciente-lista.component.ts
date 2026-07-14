import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-paciente-lista',
  templateUrl: './paciente-lista.component.html',
  styleUrls: ['./paciente-lista.component.css']
})
export class PacienteListaComponent implements OnInit {
  listaPacientes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerPacientes();
  }

  obtenerPacientes() {
    this.http.get<any[]>('https://backend-clisuecia-production.up.railway.app/api/pacientes/lista-completa').subscribe({
      next: (data) => this.listaPacientes = data,
      error: (err) => console.error('Error al obtener lista de pacientes', err)
    });
  }
}
