import { Component } from '@angular/core';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './model/medicamento';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss']
})
export class MedicamentoComponent {
  modalInstance: Modal | null = null;
  medicamentosList: Medicamento[] = [];
  medicamentoSelected: Medicamento | null = null;

  titleModal = '';
  titleBoton = '';
  modoFormulario = '';

  form: FormGroup;

  constructor(
    private medicamentoService: MedicamentoService, 
    private fb: FormBuilder) 
    {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      presentacion: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      fechaCompra: ['', [Validators.required]],
      fechaVence: ['', [Validators.required]]
    });
    this.listarMedicamentos();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => (this.medicamentosList = data),
      error: (err) => console.error('Error al listar medicamentos', err)
    });
  }

  openModal(modo: 'C' | 'E') {
    this.modoFormulario = modo;
    this.titleModal = modo === 'C' ? 'Registrar Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar' : 'Actualizar';

    const modalEl = document.getElementById('modalCrearMedicamento');
    if (modalEl) {
      this.modalInstance ??= new Modal(modalEl);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) this.modalInstance.hide();
  }

  abrirNuevoMedicamento() {
    this.medicamentoSelected = null;
    this.form.reset();
    this.openModal('C');
  }

  abrirEditarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    this.form.patchValue({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion,
      presentacion: medicamento.presentacion,
      fechaCompra: medicamento.fechaCompra,
      fechaVence: medicamento.fechaVence
    });
    this.openModal('E');
  }

  guardarMedicamento() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos', 'error');
      return;
    }

    const medicamentoData: Medicamento = { ...this.medicamentoSelected, ...this.form.value };

    const request =
      this.modoFormulario === 'C'
        ? this.medicamentoService.guardarMedicamento(medicamentoData)
        : this.medicamentoService.actualizarMedicamento(medicamentoData);

    request.subscribe({
      next: (data) => {
        Swal.fire('Éxito', data.mensaje, 'success');
        this.closeModal();
        this.listarMedicamentos();
      },
      error: (error) => {
        console.error('Error:', error);
        Swal.fire('Error', error.error.message || 'Ocurrió un error', 'error');
      }
    });
  }
}
