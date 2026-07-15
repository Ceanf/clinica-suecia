import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroMedicoComponent } from './components/registro-medico/registro-medico.component';
import { RegistroPacienteComponent } from './components/registro-paciente/registro-paciente.component';
import { AdminGuard } from './guards/admin.guard'; 
import { UsuarioListaComponent } from './components/usuario-lista/usuario-lista.component';
import { UsuarioEditarComponent } from './components/usuario-editar/usuario-editar.component';
import { PacienteListaComponent } from './components/paciente-lista/paciente-lista.component'; 
import { ConsultorioListaComponent } from './components/consultorio-lista/consultorio-lista.component';
import { CitaReservaComponent } from './components/cita-reserva/cita-reserva.component';
import { CitaListaComponent } from './components/cita-lista/cita-lista.component';
import { AgendaMedicoComponent } from './components/agenda-medico/agenda-medico.component';
import { HistorialPacienteComponent } from './components/historial-paciente/historial-paciente.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // EL REGISTRO DE PACIENTES ES PÚBLICO (No lleva canActivate)
  { path: 'registro-paciente', component: RegistroPacienteComponent },
  { path: 'mi-historial', component: HistorialPacienteComponent },{
  path: 'mi-historial',
  component: HistorialPacienteComponent,
  canActivate: [AdminGuard],
  data: {
    rolesPermitidos: ['PACIENTE']
  }
},

  // RUTA EXCLUSIVA DEL ADMINISTRADOR (Rol 1)
  { path: 'registro-medico', component: RegistroMedicoComponent, canActivate: [AdminGuard], data: { rolesPermitidos: ['ADMIN'] }},
  { path: 'usuarios', component: UsuarioListaComponent, canActivate: [AdminGuard], data: { rolesPermitidos: ['ADMIN'] }},
  { path: 'editar/:id', component: UsuarioEditarComponent, canActivate: [AdminGuard],data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'usuarios/editar-paciente/:id', component: RegistroPacienteComponent, canActivate: [AdminGuard],data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'pacientes', component: PacienteListaComponent, canActivate: [AdminGuard], data: { rolesPermitidos: ['ADMIN'] } }, 
  { path: 'consultorios', component: ConsultorioListaComponent, canActivate: [AdminGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'reservar-cita', component: CitaReservaComponent, canActivate: [AdminGuard], data: { rolesPermitidos: ['ADMIN','MEDICO','PACIENTE'] } },
  { path: 'citas', component: CitaListaComponent , canActivate: [AdminGuard], data: { rolesPermitidos: ['ADMIN','MEDICO'] } },
  { path: 'dashboard', component: DashboardComponent , canActivate: [AdminGuard], data: { rolesPermitidos: ['ADMIN'] }},
 // RUTA EXCLUSIVA DEL MÉDICO (Rol 2)
  { path: 'agenda-medico', component: AgendaMedicoComponent, canActivate: [AdminGuard],data: { rolesPermitidos: ['ADMIN','MEDICO'] }  },
  
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
