import { Component, OnInit } from '@angular/core';
import { ConsultorioService } from '../../services/consultorio.service';

@Component({
  selector: 'app-consultorio-lista',
  templateUrl: './consultorio-lista.component.html',
  styleUrls: ['./consultorio-lista.component.css']
})
export class ConsultorioListaComponent implements OnInit {

  listaConsultorios: any[] = [];
  
  // Variables para el formulario flotante
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  
  // Objeto para atrapar los datos del formulario
  consultorioActual: any = {
    nombreSala: '',
    piso: null,
    tipo: ''
  };

  mensaje: string = '';
  esError: boolean = false;

  constructor(private consultorioService: ConsultorioService) { }

  ngOnInit(): void {
    this.cargarConsultorios();
  }

  // 1. CARGAR LA TABLA
  cargarConsultorios() {
    this.consultorioService.listarConsultorios().subscribe({
      next: (data) => this.listaConsultorios = data,
      error: (err) => console.error("Error al cargar consultorios", err)
    });
  }

  // 2. ABRIR FORMULARIO PARA CREAR
  abrirNuevo() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.consultorioActual = { nombreSala: '', piso: null, tipo: '' };
    this.mensaje = '';
  }

  // 3. ABRIR FORMULARIO PARA EDITAR
  editar(consultorio: any) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    // Clonamos el objeto para no editar la tabla en tiempo real hasta darle "Guardar"
    this.consultorioActual = { ...consultorio }; 
    this.mensaje = '';
  }

  // 4. CERRAR FORMULARIO
  cancelar() {
    this.mostrarFormulario = false;
  }

  // 5. GUARDAR (Sirve tanto para Crear como para Editar)
  guardar() {
    if (this.modoEdicion) {
      this.consultorioService.actualizarConsultorio(this.consultorioActual.consultorioId, this.consultorioActual).subscribe({
        next: () => {
          this.cargarConsultorios();
          this.mostrarFormulario = false;
        },
        error: () => { this.mensaje = "Error al actualizar"; this.esError = true; }
      });
    } else {
      this.consultorioService.crearConsultorio(this.consultorioActual).subscribe({
        next: () => {
          this.cargarConsultorios();
          this.mostrarFormulario = false;
        },
        error: () => { this.mensaje = "Error al crear"; this.esError = true; }
      });
    }
  }

  // 6. ELIMINAR
  eliminar(id: number) {
    if (confirm("¿Estás seguro de eliminar este consultorio?")) {
      this.consultorioService.eliminarConsultorio(id).subscribe({
        next: () => this.cargarConsultorios(),
        error: () => alert("No se puede eliminar el consultorio. Verifica que no tenga citas asignadas.")
      });
    }
  }
}
