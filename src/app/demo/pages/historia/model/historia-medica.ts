import { Cita } from "../../cita/models/cita"
import { FormulaMedica } from "../../formula/models/formula"
import { Medicamento } from "../../medicamento/models/medicamento"

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
