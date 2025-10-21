import { Component, AfterViewInit } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { CommonModule } from '@angular/common';
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

import { Especializacion } from './models/especializacion';
import { EspecializacionService } from '../especializacion/service/especializacion.service';

@Component({
  selector: 'app-medico',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.scss']
})
export class MedicoComponent {
  modalInstance: Modal | null = null;
  medicoList: Medico[] = [];
  especializacionList: Especializacion[] = [];
  medicoSelected: Medico;

  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';

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

  constructor(
    private readonly medicoService: MedicoService,
    private readonly especializacionService: EspecializacionService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedicos();
    this.listarEspecializaciones();
    this.inicializarFormulario();
  }

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
        // Re-initialize tooltips after data is loaded
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        console.error('Error al listar medicos:', error);
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
   * Abre el modal para crear o editar un Medico.
   * @param modo 'C' para crear, 'E' para editar
   */
openModal(modo: 'C' | 'E') {
    this.modoFormulario = modo;
    this.titleModal = modo === 'C' ? 'Crear Medico' : 'Editar Medico';
    this.titleBoton = modo === 'C' ? 'Guardar Medico' : 'Actualizar Medico';
    
    const modalElement = document.getElementById('modalCrearMedico');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
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
   * Abre el modal para crear un nuevo médico.
   */
abrirNuevoMedico() {
    this.medicoSelected = null;
    // Dejamos el formulario en blanco
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
      telefono: medico.telefono,
      registroProfesional: medico.registroProfesional,
      especializacionId: medico.especializacion?.id || medico.especializacion
    });
    this.openModal('E');
  }

guardarMedico() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const medico: Medico = {
    ...this.form.value,
    especializacion: { id: 
      Number(this.form.value.especializacionId)} // usa el control 'especializacion' (contiene el id)
  };

  this.medicoService.guardarMedicos(medico).subscribe({
    next: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Médico guardado',
        text: 'El médico fue registrado exitosamente',
        timer: 2000,
        showConfirmButton: false,
      });
      this.closeModal();
      this.listarMedicos();
    },
    error: (error) => {
      console.error('Error al guardar el médico:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'No se pudo guardar el médico. Revisa los datos e intenta nuevamente.',
      });
    },
  });
}





  /**
   * Limpia los campos del formulario.
   */
  limpiarFormulario() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
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
