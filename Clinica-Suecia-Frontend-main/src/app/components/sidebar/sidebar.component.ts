import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  menuAbierto = false;

  sidebarColapsado = false;

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getRol(): string {

    const rol = localStorage.getItem('rol');

    if (rol === '1') return 'ADMIN';

    if (rol === '2') return 'MEDICO';

    if (rol === '3') return 'PACIENTE';

    return '';

  }

  esRutaPrivada(): boolean {

    const ruta = this.router.url;

    return [

      '/dashboard',

      '/usuarios',

      '/pacientes',

      '/consultorios',

      '/citas',

      '/agenda-medico',

      '/mi-historial',

      '/reservar-cita',

      '/registro-medico'

    ].includes(ruta);

  }

  logout() {

    localStorage.removeItem('token');

    localStorage.removeItem('username');

    localStorage.removeItem('rol');

    this.router.navigate(['/login']);

  }

}