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

@Component({
  selector: 'app-formula-medica',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formula-medica.component.html',
  styleUrls: ['./formula-medica.component.scss']
})
export class FormulaMedicaComponent implements OnInit {
  modalInstance: Modal | null = null;
  modoFormulario = ''
  titleModal = '';
  titleBoton = ''
  formulaMedicaList: FormulaMedica[] = [];
  formulaMedicaSelected: FormulaMedica | null = null;
  citasList: Cita[] = [];
  medicamentosList: Medicamento[] = [];

  form: FormGroup;

  ngOnInit() {
    this.listarFormulasMedicas();
    this.listarCitas();
    this.listarMedicamentos();
  }

  constructor(
    private readonly formulaMedicaService: FormulaMedicaService,
    private readonly citaService: CitaService,
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      cita: ['', Validators.required],
      medicamento: ['', Validators.required],
      dosis: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      indicaciones: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    })

    this.listarFormulasMedicas();
  }

  listarFormulasMedicas() {
    this.formulaMedicaService.listarFormulasMedicas().subscribe({
      next: (data) => (this.formulaMedicaList = data),
      error: (err) => console.error('Error al listar formulas medicas', err),
    })
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

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Formula Medica' : 'Editar Formula Medica';
    this.titleBoton = modo === 'C' ? 'Guardar Formula Medica' : 'Actualizar Formula Medica';
    this.modoFormulario = modo;
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
    this.form.patchValue({
      cita: formulaMedica.cita?.id,
      medicamento: formulaMedica.medicamento?.id,
      dosis: formulaMedica.dosis,
      indicaciones: formulaMedica.indicaciones,
    });
    this.openModal('E');
  }

  guardarFormulaMedica() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const formValue = this.form.value;

    const formulaMedica = {
      id: this.formulaMedicaSelected?.id || 0,
      cita: this.form.value.cita,
      medicamento: this.form.value.medicamento,
      dosis: this.form.value.dosis,
      indicaciones: this.form.value.indicaciones,
      fechaCreacionRegistro: new Date(),
    } as FormulaMedica;


    this.formulaMedicaService.guardarFormulaMedica(formulaMedica).subscribe({
      next: (data) => {
        Swal.fire('Éxito', data.mensaje, 'success');
        this.closeModal();
        this.listarFormulasMedicas();
      },
      error: (error) => {
        console.error('Error al guardar formula medica:', error);
        Swal.fire('Error', error.error?.message || 'Error al guardar la formula medica', 'error');
      },
    });
  }
}
