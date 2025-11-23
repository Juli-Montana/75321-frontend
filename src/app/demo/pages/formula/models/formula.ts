import { Cita } from "../../cita/models/cita";
import { Medicamento } from "../../medicamento/models/medicamento";

export class FormulaMedica {
  id?: number;
  citaId: number
  cita?: Cita;
  medicamentoId: number;
  medicamento?: Medicamento;
  dosis: string
  indicaciones: string;
  fechaCreacionRegistro?: Date;
}
