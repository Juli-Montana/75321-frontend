import { Medico } from '../../medico/models/medico';
import { Paciente } from '../../paciente/model/paciente';


export class Cita {
  id!: number;
  paciente!: Paciente;
  medico!: Medico;
  fechaHora!: string;
  estado!: string;
  motivo!: string;
}
