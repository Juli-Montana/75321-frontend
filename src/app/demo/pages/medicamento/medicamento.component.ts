import { Component } from '@angular/core';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './model/medicamento';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-medicamentos',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss']
})
export class MedicamentoComponent {
  modalInstance: Modal | null = null
  modoFormulario: string = '';
  titleModal: string = ''
  titleBoton: string = '';
  medicamentosList: Medicamento[] = [];
  medicamentoSelected: Medicamento;

  /**
   * Formulario para crear/editar medicamento.
   */
  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    presentacion: new FormControl(''),
    fechaCompra: new FormControl(''),
    fechaVence: new FormControl('')
  });

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedicamentos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      presentacion: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      fechaCompra: ['', [Validators.required]],
      fechaVence: ['', [Validators.required]]
    })
  }

  /**
  * Siempre va igual.
  */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentosList = data;
      },
      error: (error) => {
        console.error('Error al cargar medicamentos:', error);
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
     * Abre el modal para crear o editar un medicamento.
   * @param modo 'C' para crear, 'E' para editar
   */
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar Medicamento' : 'Actualizar Medicamento';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedicamento');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  /**
   * Abre el modal para crear un nuevo medicamento.
   */
  abrirNuevoMedicamento() {
    this.medicamentoSelected = new Medicamento();
    this.limpiarFormulario();
    this.openModal('C');
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
   * Abre el modal para editar un medicamento existente.
   * @param medicamento Medicamento a editar.
   */
  abrirEditarMedicamento(medicamento: Medicamento) {
    this.limpiarFormulario();
    this.medicamentoSelected = medicamento;
    this.openModal('E');
  }
  /**
     * Funcion para guardar los datos en crear/actualizar medicamento.
     */
  guardarMedicamento() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const medicamentoData: Medicamento = {
      ...this.medicamentoSelected,
      ...this.form.value,
    };

    console.log('📦 Objeto que se envía al backend:', medicamentoData);

    if (this.modoFormulario === 'C') {
      this.medicamentoService.guardarMedicamento(medicamentoData).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarMedicamentos();
        },
        error: (error) => {
          console.error('Error al guardar medicamento: ', error);
          Swal.fire('Error', error.error.message || 'No se pudo guardar', 'error');
        },
      });
    } else {
      this.medicamentoService.actualizarMedicamento(medicamentoData).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarMedicamentos();
        },
        error: (error) => {
          console.error('Error al actualizar medicamento: ', error);
          Swal.fire('Error', error.error.message || 'No se pudo actualizar', 'error');
        },
      });
    }
  }
}
