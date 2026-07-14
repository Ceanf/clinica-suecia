import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  // Lo que el usuario escribe en las cajitas del formulario (LoginDTO de Java)
  credentials = {
    username: '',
    password: ''
  };

  mensaje: string = '';

  constructor(private http: HttpClient, private router: Router) {}

 onLogin() {
    // 🚨 CORRECCIÓN: De vuelta a tu ruta original real
    this.http.post('http://localhost:8080/api/login', this.credentials).subscribe({
      next: (res: any) => {
        console.log('¡Login Exitoso con Token JWT!', res);
        
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('rol', res.rolId.toString());

        // 🚨 CORRECCIÓN: Forzamos la conversión a Número para que el 'if' funcione perfecto
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
          this.mensaje = "Credenciales incorrectas o usuario no encontrado.";
        } else {
          this.mensaje = "Error de conexión. Revisa que el backend esté corriendo en el puerto 8080.";
        }
      }
    });
  }
}
