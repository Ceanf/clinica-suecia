import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroMedicoComponent } from './components/registro-medico/registro-medico.component';
import { RegistroPacienteComponent } from './components/registro-paciente/registro-paciente.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsuarioListaComponent } from './components/usuario-lista/usuario-lista.component';
import { UsuarioEditarComponent } from './components/usuario-editar/usuario-editar.component';
import { PacienteListaComponent } from './components/paciente-lista/paciente-lista.component';
import { ConsultorioListaComponent } from './components/consultorio-lista/consultorio-lista.component';
import { CitaReservaComponent } from './components/cita-reserva/cita-reserva.component';
import { CitaListaComponent } from './components/cita-lista/cita-lista.component';
import { AgendaMedicoComponent } from './components/agenda-medico/agenda-medico.component';
import { HistorialPacienteComponent } from './components/historial-paciente/historial-paciente.component';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroMedicoComponent,
    RegistroPacienteComponent,
    NavbarComponent,
    UsuarioListaComponent,
    UsuarioEditarComponent,
    PacienteListaComponent,
    ConsultorioListaComponent,
    CitaReservaComponent,
    CitaListaComponent,
    AgendaMedicoComponent,
    HistorialPacienteComponent,
    DashboardComponent,
    HomeComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,       
    CommonModule,
    RouterModule,
    NgChartsModule
  ],
  // 🚨 3. Registramos y encendemos el Interceptor aquí
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }