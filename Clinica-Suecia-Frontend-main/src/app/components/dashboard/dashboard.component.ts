import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartOptions, Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Variables para las tarjetas numéricas
  kpis: any = { totalPacientes: 0, totalMedicos: 0, citasDeHoy: 0 };

  // 📊 Configuración Inicial del Gráfico de Barras
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };
  public barChartOptions: ChartOptions<'bar'> = { responsive: true };

  // 🍩 Configuración Inicial del Gráfico de Anillo
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };
  // Quitamos la caja fuerte para darle un diseño más limpio
  public doughnutChartOptions: ChartOptions<'doughnut'> = { 
    responsive: true,
    cutout: '70%', // Hace el anillo más delgado y elegante
    plugins: {
      legend: { position: 'top' }
    }
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    // 🚨 NUEVO: Le decimos a los gráficos que usen Poppins por defecto
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.color = '#6c757d'; // Un gris elegante para los textos del gráfico

    // Llamamos al backend que preparamos en Java
    this.http.get<any>('https://backend-clisuecia-production.up.railway.app/api/dashboard/resumen').subscribe(res => {
      
      // 1. Llenamos las tarjetas superiores
      this.kpis.totalPacientes = res.totalPacientes;
      this.kpis.totalMedicos = res.totalMedicos;
      this.kpis.citasDeHoy = res.citasDeHoy;

      // 2. Llenamos y DISEÑAMOS el Gráfico de Barras
      const medLabels = res.topMedicamentos.map((m: any) => m.medicamento);
      const medData = res.topMedicamentos.map((m: any) => m.cantidad);
      
      this.barChartData = {
  labels: medLabels,
  datasets: [
    {
      data: medData,
      label: 'Veces Recetado',
      backgroundColor: (context) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;

        if (!chartArea) {
          // Si el área aún no está lista, devuelve un color fijo
          return '#1aa483';
        }

        const gradient = ctx.createLinearGradient(
          chartArea.left, chartArea.top,
          chartArea.left, chartArea.bottom
        );
        gradient.addColorStop(0, '#1aa483'); // Verde Teal
        gradient.addColorStop(1, '#126b56'); // Verde oscuro

        return gradient;
      },
      hoverBackgroundColor: '#126b56',
      borderRadius: 8,
      barPercentage: 0.5
    }
  ]
};


      // 3. Llenamos y DISEÑAMOS el Gráfico de Anillo
      const estadoLabels = res.citasPorEstado.map((e: any) => e.estado);
      const estadoData = res.citasPorEstado.map((e: any) => e.cantidad);
      
      this.doughnutChartData = {
        labels: estadoLabels,
        datasets: [ 
          { 
            data: estadoData, 
            // Usamos los colores armónicos de tus tarjetas (Teal, Oliva, Púrpura y un rojo suave por si hay canceladas)
            backgroundColor: ['#1aa483', '#81b15c', '#5b62b1', '#d96e6e'], 
            hoverBackgroundColor: ['#126b56', '#4c7132', '#353a73', '#b85e5e'],
            borderWidth: 0,       // 🚨 Quita los bordes blancos 
            hoverOffset: 6        // 🚨 Efecto 3D al pasar el mouse
          } 
        ]
      };
    });
  }
}