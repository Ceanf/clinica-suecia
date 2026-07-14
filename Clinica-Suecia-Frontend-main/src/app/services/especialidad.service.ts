import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  
  private apiUrl = 'http://localhost:8080/api/especialidades'; // La URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para obtener la lista desde Java
  obtenerEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
