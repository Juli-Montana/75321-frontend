import { Cita } from "../../cita/model/cita"
import { FormulaMedica } from "../../formula-medica/model/formula-medica"
import { Medicamento } from "../../medicamento/model/medicamento"

export class HistoriaMedica {
  id: number
  pacienteId: number
  medicoId: number
  fechaCreacion: Date
  diagnostico: string
  observaciones: string
  citas: Cita[] = []
  formulasMedicas: FormulaMedica[] = []
  medicamentos: Medicamento[] = []
  especializacionId?: number
}
