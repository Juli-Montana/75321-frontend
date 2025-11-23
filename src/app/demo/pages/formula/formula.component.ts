import { Component, OnInit } from '@angular/core';
import { FormulaMedica } from './models/formula';
import { FormulaMedicaService } from './service/formula.service';
import { Medicamento } from '../medicamento/models/medicamento';
import { MedicamentoService } from '../medicamento/service/medicamento.service';
import { Cita } from '../cita/models/cita';
import { CitaService } from '../cita/service/cita.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';
import { NgxSpinnerModule, NgxSpinnerService  } from "ngx-spinner";

@Component({
  selector: 'app-formula-medica',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss']
})
export class FormulaComponent implements OnInit {
  modalInstance: Modal | null = null;
  modoFormulario = ''
  titleModal = '';
  titleBoton = ''
  formulaMedicaList: FormulaMedica[] = [];
  formulaMedicaSelected: FormulaMedica | null = null;
  citasList: Cita[] = [];
  medicamentosList: Medicamento[] = [];
  titleSpinner: string = 'Cargando...';


  form: FormGroup;

  today = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.listarFormulasMedicas();
    this.listarCitas();
    this.listarMedicamentos();
  }

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
    })

    this.listarFormulasMedicas();
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);

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
      citaId: formulaMedica.cita?.id,
      medicamentoId: formulaMedica.medicamento?.id,
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

    const { citaId, medicamentoId, dosis, indicaciones } = this.form.value;
    const formulaMedica: FormulaMedica = {
      citaId,
      medicamentoId,
      dosis,
      indicaciones,
    };

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


