import { Component, OnInit } from '@angular/core';
import { FormulaMedica } from './model/formula-medica';
import { FormulaMedicaService } from './service/formula-medica.service';
import { Medicamento } from '../medicamento/model/medicamento';
import { MedicamentoService } from '../medicamento/service/medicamento.service';
import { Cita } from '../cita/model/cita';
import { CitaService } from '../cita/service/cita.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { FilterFormulaMedicaPipe } from './pipes/filter-formula-medica.pipe';

@Component({
  selector: 'app-formula-medica',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, FilterFormulaMedicaPipe],
  templateUrl: './formula-medica.component.html',
  styleUrls: ['./formula-medica.component.scss']
})
export class FormulaMedicaComponent implements OnInit {
  modalInstance: Modal | null = null;
  modoFormulario = '';
  titleModal = '';
  titleBoton = '';
  formulaMedicaList: FormulaMedica[] = [];
  formulaMedicaSelected: FormulaMedica | null = null;
  citasList: Cita[] = [];
  medicamentosList: Medicamento[] = [];
  titleSpinner: string = 'Cargando...';
  filtroColumna: string = '';

  form: FormGroup;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private readonly formulaMedicaService: FormulaMedicaService,
    private readonly citaService: CitaService,
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService,
  ) {
    this.form = this.formBuilder.group({
      citaId: ['', Validators.required],
      medicamentoId: ['', Validators.required],
      dosis: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      indicaciones: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    });

    this.listarFormulasMedicas();
    this.spinner.show();
    setTimeout(() => this.spinner.hide(), 5000);
  }

  ngOnInit() {
    this.listarFormulasMedicas();
    this.listarCitas();
    this.listarMedicamentos();
  }

  listarFormulasMedicas() {
    this.formulaMedicaService.listarFormulasMedicas().subscribe({
      next: (data) => (this.formulaMedicaList = data),
      error: (err) => console.error('Error al listar fórmulas médicas', err),
    });
  }

  listarCitas() {
    this.citaService.listarCitas().subscribe({
      next: (data) => (this.citasList = data),
      error: (err) => console.error('Error al listar citas', err),
    });
  }

  listarMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => (this.medicamentosList = data),
      error: (err) => console.error('Error al listar medicamentos', err),
    });
  }

  closeModal() {
    this.modalInstance?.hide();
  }

  openModal(modo: string, formulaMedica?: FormulaMedica) {
    this.titleModal = modo === 'C' ? 'Crear Fórmula Médica' : 'Editar Fórmula Médica';
    this.titleBoton = modo === 'C' ? 'Guardar Fórmula Médica' : 'Actualizar Fórmula Médica';
    this.modoFormulario = modo;

    if (modo === 'E' && formulaMedica) {
      this.form.patchValue({
        citaId: formulaMedica.cita?.id,
        medicamentoId: formulaMedica.medicamento?.id,
        dosis: formulaMedica.dosis,
        indicaciones: formulaMedica.indicaciones,
      });
      this.formulaMedicaSelected = formulaMedica;
    } else {
      this.form.reset();
      this.formulaMedicaSelected = null;
    }

    const modalElement = document.getElementById('modalCrearFormulaMedica');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaFormulaMedica() {
    this.formulaMedicaSelected = null;
    this.form.reset();
    this.openModal('C');
  }

  abrirEditarFormulaMedica(formulaMedica: FormulaMedica) {
    this.formulaMedicaSelected = formulaMedica;
    this.openModal('E', formulaMedica);
  }

  guardarFormulaMedica() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const { citaId, medicamentoId, dosis, indicaciones } = this.form.value;
    const formulaMedica: FormulaMedica = { citaId, medicamentoId, dosis, indicaciones };

    if (this.modoFormulario === 'C') {
      // Verificar si ya existe una fórmula para la misma cita y medicamento
      const existe = this.formulaMedicaList.some(
        f => f.cita?.id === citaId && f.medicamento?.id === medicamentoId
      );

      if (existe) {
        Swal.fire('Error', 'Ya existe una fórmula médica con esta cita y medicamento', 'error');
        return;
      }

      this.formulaMedicaService.guardarFormulaMedica(formulaMedica).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarFormulasMedicas();
        },
        error: (error) => {
          console.error('Error al guardar fórmula médica:', error);
          Swal.fire('Error', error.error?.message || 'Error al guardar la fórmula médica', 'error');
        },
      });

    } else if (this.modoFormulario === 'E' && this.formulaMedicaSelected) {
      // Mantener la cita y medicamento original del registro
      formulaMedica.citaId = this.formulaMedicaSelected.cita?.id;
      formulaMedica.medicamentoId = this.formulaMedicaSelected.medicamento?.id;

      this.formulaMedicaService.actualizarFormulaMedica(formulaMedica).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarFormulasMedicas();
        },
        error: (err) => {
          console.error('Error al actualizar fórmula médica', err);
          Swal.fire('Error', 'No se pudo actualizar la fórmula médica', 'error');
        },
      });
    }
  }
}
