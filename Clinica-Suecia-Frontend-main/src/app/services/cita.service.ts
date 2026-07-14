import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) { }

  // 1. AGENDAR CITA (POST)
  // Usamos responseType: 'text' por si Java nos devuelve el mensaje de error de cruce de horarios
  agendarCita(citaDto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, citaDto);
  }

  // 2. LISTAR TODAS (Para el Admin)
  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 3. LISTAR POR PACIENTE
  listarPorPaciente(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  // 4. LISTAR POR MÉDICO
  listarPorMedico(medicoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medico/${medicoId}`);
  }

  // 5. ATENDER CITA (Médico registra diagnóstico)
  atenderCita(id: number, atencionDto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/atender/${id}`, atencionDto);
  }

  // 6. MARCAR INASISTENCIA
  marcarInasistencia(id: number): Observable<any> {
    // Como no enviamos cuerpo (body), mandamos un objeto vacío {}
    return this.http.put<any>(`${this.apiUrl}/inasistencia/${id}`, {});
  }
}