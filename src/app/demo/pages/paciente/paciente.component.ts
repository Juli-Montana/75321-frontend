import { Component, AfterViewInit } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './model/paciente';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})

export class PacienteComponent {
  modalInstance: Modal | null = null;
  pacientesList: Paciente[] = [];
  pacienteSelected: Paciente | null = null;

  titleModal = '';
  titleBoton = '';
  modoFormulario = '';

  form: FormGroup;

  constructor(
    private pacienteService: PacienteService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      tipoDocumento: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    });

    this.listarPacientes();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => (this.pacientesList = data),
      error: (err) => console.error('Error al listar pacientes', err)
    });
  }

  openModal(modo: 'C' | 'E') {
    this.modoFormulario = modo;
    this.titleModal = modo === 'C' ? 'Registrar Paciente' : 'Editar Paciente';
    this.titleBoton = modo === 'C' ? 'Guardar' : 'Actualizar';

    const modalEl = document.getElementById('modalCrearPaciente');
    if (modalEl) {
      this.modalInstance ??= new Modal(modalEl);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) this.modalInstance.hide();
  }

  abrirNuevoPaciente() {
    this.pacienteSelected = null;
    this.form.reset({ id: null });
    this.openModal('C');
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.pacienteSelected = paciente;
    this.form.patchValue({
      id: paciente.id,
      tipoDocumento: paciente.tipoDocumento,
      numeroDocumento: paciente.numeroDocumento,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      fechaNacimiento: paciente.fechaNacimiento,
      genero: paciente.genero,
      telefono: paciente.telefono,
      direccion: paciente.direccion
    });
    this.openModal('E');
  }

  guardarPaciente() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos', 'error');
      return;
    }

    const pacienteData: Paciente = {...this.form.value,id: this.pacienteSelected?.id || this.form.value.id || null};


    const request =
      this.modoFormulario === 'C'
        ? this.pacienteService.guardarPaciente(pacienteData)
        : this.pacienteService.actualizarPaciente(pacienteData);

    request.subscribe({
      next: (data) => {
        Swal.fire('Éxito', data.mensaje, 'success');
        this.closeModal();
        this.listarPacientes();
      },
      error: (error) => {
        console.error('Error:', error);
        Swal.fire('Error', error.error.message || 'Ocurrió un error', 'error');
      }
    });
  }
}

