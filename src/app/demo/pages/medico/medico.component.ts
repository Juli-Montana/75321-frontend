import { Component, AfterViewInit } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService  } from "ngx-spinner";
// Import Bootstrap JS for tooltips
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';
import { Especializacion } from '../especializacion/model/especializacion';
import { EspecializacionService } from '../especializacion/service/especializacion.service';
import { FiltermedicoPipe } from './pipes/filter-medico.pipe';

@Component({
  selector: 'app-medico',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,FiltermedicoPipe,NgxSpinnerModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent implements AfterViewInit {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicoList: Medico[] = [];
  especializacionList: Especializacion[] = [];
  medicoSelected: Medico;
  titleSpinner: string = 'Cargando...';
  
  
  filtroColumna: string = '';
  

  /**
   * Formulario para crear/editar médico.
   */
  form: FormGroup = new FormGroup({
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    registroProfesional: new FormControl(''),
    telefono: new FormControl(''),
    especializacion: new FormControl('')
  });
medico: Medico;

  constructor(
    private readonly medicoService: MedicoService,
    private readonly especializacionService: EspecializacionService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedicos();
    this.listarEspecializaciones();
    this.inicializarFormulario();
  }

  tipoDocumentos: { valor: string, label: string }[] = [
    { valor: 'CC', label: 'Cédula de Ciudadanía' },
    { valor: 'CE', label: 'Cédula de Extranjería' },
    { valor: 'TI', label: 'Tarjeta de Identidad' },
    { valor: 'PASAPORTE', label: 'Pasaporte' },
  ];

  /**
   * Relaciona el formulario inicial con sus respectivos validadores.
   */
  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      registroProfesional: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
      especializacionId: ['', [Validators.required]]
    });
  }

  /**
   * Siempre va igual.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngAfterViewInit() {
    // Inicializa el tooltip de Bootstrap
    this.initializeTooltips();
  }

  listarMedicos() {
    this.medicoService.listarMedicos().subscribe({
      next: (data) => {
        this.medicoList = data;
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        console.error('Error fetching medicos:', error);
      }
    });
  }

  listarEspecializaciones() {
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => (this.especializacionList = data),
      error: (err) => console.error('Error al listar especializaciones', err),
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
   * Abre el modal para crear o editar un Medico.
   * @param modo 'C' para crear, 'E' para editar
   */
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Medico' : 'Editar Medico';
    this.titleBoton = modo === 'C' ? 'Guardar Medico' : 'Actualizar Medico';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedico');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  /**
   * Abre el modal para crear un nuevo médico.
   */
  abrirNuevoMedico() {
    this.medicoSelected = null;
    this.form.reset();
    this.openModal('C');
  }

  /**
   * Abre el modal para editar un usuario existente.
   * @param medico Medico a editar.
   */
  abrirEditarMedico(medico: Medico) {
    this.medicoSelected = medico;
    this.form.patchValue({
      nombres: medico.nombres,
      apellidos: medico.apellidos,
      tipoDocumento: medico.tipoDocumento,
      numeroDocumento: medico.numeroDocumento,
      registroProfesional: medico.registroProfesional,
      telefono: medico.telefono,
      especializacionId: medico.especializacionId
    });
    this.openModal('E');
  }

  guardarMedico() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const { nombres, apellidos, tipoDocumento, numeroDocumento, registroProfesional, telefono, especializacionId } = this.form.value;
    console.log('Formulario de médico:', this.form.value);
    const medico: Medico = {
      nombres,
      apellidos,
      tipoDocumento,
      numeroDocumento,
      registroProfesional,
      telefono,
      especializacionId: Number(especializacionId)
    };

    console.log('Datos del médico a guardar:', medico);

    this.medicoService.guardarMedico(medico).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Médico guardado correctamente', 'success');
        this.closeModal();
        this.listarMedicos();
      },
      error: (err) => {
        console.error('Error al guardar médico', err);
        Swal.fire('Error', 'Ocurrió un error al guardar el médico', 'error');
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
