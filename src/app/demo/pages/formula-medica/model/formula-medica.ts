import { Cita } from "../../cita/model/cita";
import { Medicamento } from "../../medicamento/model/medicamento";

export class FormulaMedica {
  id?: number;
  citaId?: number;
  cita?: Cita;
  medicamentoId: number;
  medicamento?: Medicamento;
  dosis: string
  indicaciones: string;
  fechaCreacionRegistro?: Date;
}
