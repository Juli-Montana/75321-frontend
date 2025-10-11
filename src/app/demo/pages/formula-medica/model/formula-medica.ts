import { Cita } from '../../cita/model/cita';
import { Medicamento } from '../../medicamento/model/medicamento';

export class FormulaMedica {
  id!: number;
  cita!: Cita;
  medicamento!: Medicamento;
  dosis!: string;
  indicaciones!: string;
  fechaCreacionRegistro!: Date;
}
