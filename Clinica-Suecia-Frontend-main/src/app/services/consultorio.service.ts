import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultorioService {

  private apiUrl = 'https://backend-clisuecia-production.up.railway.app/api/consultorios'; // La URL de tu Chef en Java

  constructor(private http: HttpClient) { }

  // 1. LEER (GET)
  listarConsultorios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 2. CREAR (POST)
  crearConsultorio(consultorio: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, consultorio);
  }

  // 3. ACTUALIZAR (PUT)
  actualizarConsultorio(id: number, consultorio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, consultorio);
  }

  // 4. ELIMINAR (DELETE)
  eliminarConsultorio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }
}
