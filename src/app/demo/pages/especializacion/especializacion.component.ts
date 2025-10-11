import { Component, OnInit } from '@angular/core';
import { Especializacion } from '../medico/models/especializacion';
import { EspecializacionService } from './service/especializacion.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './especializacion.component.html',
  styleUrls: ['./especializacion.component.scss']
})
export class EspecializacionComponent {
  modalInstance: Modal | null = null;
  modoFormulario = ''
  titleModal = '';
  titleBoton = ''
  especializacionList: Especializacion[] = [];
  especializacionSelected: Especializacion | null = null;

  form: FormGroup;

  constructor(
    private readonly especializacionService: EspecializacionService,
    private readonly formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      codigoEspecializacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    })
    this.listarEspecializaciones();
  }

  listarEspecializaciones() {
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => (this.especializacionList = data),
      error: (err) => console.error('Error al listar formulas medicas', err),
    })
  }

  closeModal() {
    this.modalInstance?.hide();
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Especializacion' : 'Editar Especializacion';
    this.titleBoton = modo === 'C' ? 'Guardar Especializacion' : 'Actualizar Especializacion';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearEspecializacion');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaEspecializacion() {
    this.especializacionSelected = null;
    this.form.reset();
    this.openModal('C');
  }

  abrirEditarEspecializacion(especializacion: Especializacion) {
    this.especializacionSelected = especializacion;
    this.form.patchValue({
      nombre: especializacion.nombre,
      descripcion: especializacion.descripcion,
      codigoEspecializacion: especializacion.codigoEspecializacion,
    });
    this.openModal('E');
  }

  guardarFormulaMedica() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    alert('Implementar guardado de especializacion');
    this.closeModal();
  }
}
