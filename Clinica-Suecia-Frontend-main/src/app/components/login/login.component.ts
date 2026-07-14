import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // URL del Backend
  private api = environment.apiUrl;

  credentials = {
    username: '',
    password: ''
  };

  mensaje: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onLogin() {

    this.http.post(`${this.api}/api/login`, this.credentials).subscribe({

      next: (res: any) => {

        console.log('¡Login Exitoso!', res);

        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('rol', res.rolId.toString());

        const rol = Number(res.rolId);

        if (rol === 1) {

          this.router.navigate(['/dashboard']);

        } else if (rol === 2) {

          this.router.navigate(['/agenda-medico']);

        } else if (rol === 3) {

          this.router.navigate(['/mi-historial']);

        }

      },

      error: (err) => {

        if (err.status === 401 || err.status === 404) {

          this.mensaje =
            'Credenciales incorrectas o usuario no encontrado.';

        } else {

          this.mensaje =
            'No se pudo conectar con el servidor.';

        }

      }

    });

  }

}