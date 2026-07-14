import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  especialidades: any[] = [];
medicos: any[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.cargarEspecialidades();
    this.cargarMedicos();

  }

  cargarEspecialidades() {

    this.http.get<any[]>("http://localhost:8080/api/especialidades")
      .subscribe({

        next: data => {

          this.especialidades = data;

        },

        error: err => {

          console.log(err);

        }

      });

  }
cargarMedicos() {

  this.http.get<any[]>("http://localhost:8080/api/medicos")
    .subscribe({

      next: data => {

        this.medicos = data;

      },

      error: err => {

        console.log(err);

      }

    });

}
}