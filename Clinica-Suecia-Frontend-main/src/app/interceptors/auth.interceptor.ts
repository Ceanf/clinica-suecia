import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // 1. Buscamos el token en el bolsillo (localStorage)
    const token = localStorage.getItem('token');

    // 2. Si hay token, clonamos la petición y se lo pegamos en la cabecera
    if (token) {
      const clonedRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
      // Dejamos que viaje hacia Java con su gafete puesto
      return next.handle(clonedRequest);
    }

    // Si no hay token (ej. cuando apenas estás haciendo login), viaja sin gafete
    return next.handle(request);
  }
}
