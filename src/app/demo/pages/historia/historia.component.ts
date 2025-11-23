import { Component, OnInit } from '@angular/core';
import { HistoriaMedica } from './model/historia-medica';
import { HistoriaService } from './service/historia.service';
import { Paciente } from '../paciente/models/paciente';
import { PacienteService } from '../paciente/service/paciente.service';
import { Medico } from '../medico/models/medico';
import { MedicoService } from '../medico/service/medico.service';
import { Cita } from '../cita/models/cita';
import { CitaService } from '../cita/service/cita.service';
import { FormulaMedica } from '../formula/models/formula';
import { FormulaMedicaService } from '../formula/service/formula.service';
import { Especializacion } from '../especializacion/models/especializacion';
import { EspecializacionService } from '../especializacion/service/especializacion.service';
import { Medicamento } from '../medicamento/models/medicamento';
import { MedicamentoService } from '../medicamento/service/medicamento.service';
import { FormsModule, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historia',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss']
})
export class HistoriaComponent implements OnInit {
  modalInstance: Modal | null = null;
  modoFormulario = ''
  titleModal = '';
  titleBoton = ''
  historiaMedicaList: HistoriaMedica[] = [];
  historiaMedicaSelected: HistoriaMedica | null = null;
  pacienteList: Paciente[] = [];
  medicoList: Medico[] = []
  citasList: Cita[] = [];
  formulaMedicaList: FormulaMedica[] = [];
  especializacionList: Especializacion[] = [];
  medicamentosList: Medicamento[] = [];
  titleSpinner: string = 'Cargando...';

  form: FormGroup;

  ngOnInit() {
    this.listarHistoriasMedicas();
    this.listarPacientes();
    this.listarMedicos();
    this.listarCitas();
    this.listarFormulasMedicas();
    this.listarEspecializaciones();
    this.listarMedicamentos();
  }

  constructor(
    // private readonly historiaMedicaService: HistoriaMedicaService,
    private readonly pacienteService: PacienteService,
    private readonly medicoService: MedicoService,
    private readonly citaService: CitaService,
    private readonly formulaMedicaService: FormulaMedicaService,
    private readonly especializacionService: EspecializacionService,
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.form = this.formBuilder.group({
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      diagnostico: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      observaciones: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      especializacionId: [''],
    })

    this.listarHistoriasMedicas();
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }
  listarHistoriasMedicas() {
    // Datos de prueba
    this.historiaMedicaList = [
      {
        id: 1,
        pacienteId: 1,
        medicoId: 2,
        fechaCreacion: new Date(),
        diagnostico: "Dolor de cabeza",
        observaciones: "Reposo y hidratación",
        citas: [],
        formulasMedicas: [],
        medicamentos: [],
        especializacionId: 3
      },
      {
        id: 2,
        pacienteId: 3,
        medicoId: 2,
        fechaCreacion: new Date(),
        diagnostico: "Gripe",
        observaciones: "Tomar medicamentos y reposo",
        citas: [],
        formulasMedicas: [],
        medicamentos: [],
        especializacionId: 1
      }
    ];
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => (this.pacienteList = data),
      error: (err) => console.error('Error al listar pacientes', err),
    })
  }

  listarMedicos() {
    this.medicoService.listarMedicos().subscribe({
      next: (data) => (this.medicoList = data),
      error: (err) => console.error('Error al listar medicos', err),
    })
  }

  listarCitas() {
    this.citaService.listarCitas().subscribe({
      next: (data) => (this.citasList = data),
      error: (err) => console.error('Error al listar citas', err),
    });
  }

  listarFormulasMedicas() {
    this.formulaMedicaService.listarFormulasMedicas().subscribe({
      next: (data) => (this.formulaMedicaList = data),
      error: (err) => console.error('Error al listar formulas medicas', err),
    })
  }

  listarEspecializaciones() {
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => (this.especializacionList = data),
      error: (err) => console.error('Error al listar especializaciones', err),
    })
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
    this.titleModal = modo === 'C' ? 'Crear Historia Medica' : 'Editar Historia Medica';
    this.titleBoton = modo === 'C' ? 'Guardar Historia Medica' : 'Actualizar Historia Medica';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearHistoriaMedica');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaHistoriaMedica() {
    this.historiaMedicaSelected = null;
    this.form.reset();
    this.openModal('C');
  }

  abrirEditarHistoriaMedica(historiaMedica: HistoriaMedica) {
    this.historiaMedicaSelected = historiaMedica;
    this.form.patchValue({
      pacienteId: historiaMedica.pacienteId,
      medicoId: historiaMedica.medicoId,
      fechaCreacion: historiaMedica.fechaCreacion,
      diagnostico: historiaMedica.diagnostico,
      observaciones: historiaMedica.observaciones,
      especializacionId: historiaMedica.especializacionId,
    });
    this.openModal('E');
  }


}
