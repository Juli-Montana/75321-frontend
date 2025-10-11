import { AfterViewInit, Component } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './model/paciente';
import { CommonModule } from '@angular/common';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements AfterViewInit {
  pacienteList: Paciente[] = [];

  constructor(private readonly pacienteService: PacienteService) {
    this.listarPacientes();
  }

  ngAfterViewInit() {
    // Inicializa el tooltip de Bootstrap
    this.initializeTooltips();
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        console.log(data);
        this.pacienteList = data;
        // Re-initialize tooltips after data is loaded
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        console.error('Error fetching pacientes:', error);
      }
    })
  }

  /**
 * Initialize Bootstrap tooltips
 */
  private initializeTooltips() {
    try {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        // Safe way to access Bootstrap's Tooltip constructor
        const bootstrapGlobal = (window as unknown as { bootstrap?: { Tooltip: new (element: Element) => void } }).bootstrap;
        if (bootstrapGlobal) {
          new bootstrapGlobal.Tooltip(tooltipTriggerEl);
        }
      });
    } catch (error) {
      console.warn('Bootstrap tooltips could not be initialized:', error);
    }
  }
}
