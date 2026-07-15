import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  menuAbierto: boolean = false;
  sidebarColapsado: boolean = false;

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  // Traducción del ID del rol
  getRol(): string {

    const rolId = localStorage.getItem('rol');

    if (rolId === '1') return 'ADMIN';

    if (rolId === '2') return 'MEDICO';

    if (rolId === '3') return 'PACIENTE';

    return '';

  }

  // NUEVO MÉTODO
  esPaginaPublica(): boolean {

    const ruta = this.router.url;

    return (

      ruta === '/' ||

      ruta === '/login' ||

      ruta === '/registro-paciente'

    );

  }

  logout() {

    localStorage.removeItem('token');

    localStorage.removeItem('username');

    localStorage.removeItem('rol');

    this.router.navigate(['/login']);

  }

}