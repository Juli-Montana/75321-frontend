import { AfterViewInit, Component } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './model/paciente';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService  } from "ngx-spinner";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FormulaMedica } from '../formula-medica/model/formula-medica';
import { FilterPacientesPipe } from './pipes/filter-paciente.pipe';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilterPacientesPipe,NgxSpinnerModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements AfterViewInit {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  pacienteList: Paciente[] = [];
  pacienteSelected: Paciente;
  titleSpinner: string = 'Cargando...';

  form: FormGroup;
  paciente: Paciente;

  filtroColumna: string = '';

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
    })
    this.listarPacientes();
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);

  }

  tipoDocumentos: { valor: string, label: string }[] = [
    { valor: 'CC', label: 'Cédula de Ciudadanía' },
    { valor: 'CE', label: 'Cédula de Extranjería' },
    { valor: 'TI', label: 'Tarjeta de Identidad' },
    { valor: 'PASAPORTE', label: 'Pasaporte' },
  ];

  generos: { valor: string, label: string }[] = [
    { valor: 'MASCULINO', label: 'Masculino' },
    { valor: 'FEMENINO', label: 'Femenino' },
    { valor: 'OTRO', label: 'Otro' },
  ];

  ngAfterViewInit() {
    // Inicializa el tooltip de Bootstrap
    this.initializeTooltips();
  }

  /**
   * Siempre va igual.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.pacienteList = data;
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        console.error('Error fetching pacientes:', error);
      }
    })
  }

  /**
   * Funcion para cerrar el modal.
   */
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  /**
     * Abre el modal para crear o editar un usuario.
     * @param modo 'C' para crear, 'E' para editar
     */
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Paciente' : 'Editar Paciente';
    this.titleBoton = modo === 'C' ? 'Guardar Paciente' : 'Actualizar Paciente';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearPaciente');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoPaciente() {
    this.pacienteSelected = new Paciente();
    this.form.reset();
    this.openModal('C');
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.pacienteSelected = paciente;
    this.form.patchValue({
      tipoDocumento: paciente.tipoDocumento?.toUpperCase(),
      genero: paciente.genero?.toUpperCase(),
      numeroDocumento: paciente.numeroDocumento,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      fechaNacimiento: paciente.fechaNacimiento,
      direccion: paciente.direccion,
      telefono: paciente.telefono,
    });
    this.openModal('E');
  }

  guardarPaciente() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const { tipoDocumento, numeroDocumento, nombres, apellidos, fechaNacimiento, genero, direccion, telefono } = this.form.value;
    const paciente: Paciente = {
      id: this.modoFormulario === 'E' ? this.pacienteSelected.id : undefined,
      tipoDocumento,
      numeroDocumento,
      nombres,
      apellidos,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
    };


    this.pacienteService.guardarPaciente(paciente).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Paciente guardado correctamente', 'success');
        this.closeModal();
        this.listarPacientes();
      },
      error: (error) => {
        console.error('Error al guardar usuario: ', error);
        Swal.fire('Error', error.error.message, 'error');
      }
    });

    this.pacienteService.actualizarPaciente(paciente).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Paciente actualizado correctamente', 'success');
        this.closeModal();
        this.listarPacientes();
      },
      error: (error) => {
        console.error('Error al actualizar paciente: ', error);
        Swal.fire('Error', error.error.message, 'error');
      }
    });

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
