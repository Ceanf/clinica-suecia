import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  
  private apiUrl = 'https://backend-clisuecia-production.up.railway.app/api/especialidades'; // La URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para obtener la lista desde Java
  obtenerEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
