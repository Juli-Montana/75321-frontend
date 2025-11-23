import { Pipe, PipeTransform } from '@angular/core';
import { Paciente } from '../model/paciente';

@Pipe({
  name: 'filterPacientes',
  standalone: true
})
export class FilterPacientesPipe implements PipeTransform {
  transform(pacientes: Paciente[], filtro: string = ''): Paciente[] {
    if (!pacientes) return [];
    if (!filtro.trim()) return pacientes;

    const termino = filtro.toLowerCase();

    return pacientes.filter(e =>
      e.tipoDocumento.toLowerCase().includes(termino) ||
      e.numeroDocumento.toLowerCase().includes(termino) ||
      e.nombres.toLowerCase().includes(termino) ||
      e.apellidos.toLowerCase().includes(termino) ||
      e.genero.toLowerCase().includes(termino) ||
      e.direccion.toLowerCase().includes(termino) ||
      e.telefono.toLowerCase().includes(termino)
    );
  }
}
