import { Especializacion } from './especializacion';

export class Medico {
  id!: number;
  nombres!: string;
  apellidos!: string;
  tipoDocumento!: string;
  numeroDocumento!: string;
  registroProfesional!: string;
  telefono!: string;
  especializacion!: Especializacion;
}
