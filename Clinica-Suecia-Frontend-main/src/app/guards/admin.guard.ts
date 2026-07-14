import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const rolUsuario = localStorage.getItem('rol'); // Devuelve '1', '2' o '3'

    // 1. Si no hay token, directo al login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    // 2. LEER LOS ROLES PERMITIDOS DE LA RUTA
    // Con 'route.data' accedemos a la configuración de la URL que el usuario quiere pisar
    const rolesPermitidos = route.data['rolesPermitidos'] as Array<string>;

    // Si la ruta no tiene roles especificados, dejamos pasar por defecto
    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }
    // 3. MAPEAR EL NÚMERO DE ROL A TEXTO PARA COMPARAR
    let rolTexto = '';
    if (rolUsuario === '1') rolTexto = 'ADMIN';
    if (rolUsuario === '2') rolTexto = 'MEDICO';
    if (rolUsuario === '3') rolTexto = 'PACIENTE';

    // 4. VERIFICAR SI EL ROL DEL USUARIO ESTÁ EN LA LISTA PERMITIDA
    if (rolesPermitidos.includes(rolTexto)) {
      return true; // ¡Permiso concedido!
    }

    // 5. SI NO TIENE PERMISO: Alerta y expulsión
    console.warn(`Acceso denegado para el rol ${rolTexto}. Se requiere uno de estos: ${rolesPermitidos}`);
    this.router.navigate(['/login']);
    return false;
  }
}
