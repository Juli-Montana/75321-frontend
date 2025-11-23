import { Pipe, PipeTransform } from '@angular/core';
import { Medico } from '../models/medico';

@Pipe({
  name: 'filtermedico',
  standalone: true
})
export class FiltermedicoPipe implements PipeTransform {
  transform(medico: Medico[], filtro: string = ''): Medico[] {
    if (!medico) return [];
    if (!filtro.trim()) return medico;

    const termino = filtro.toLowerCase();

    return medico.filter(e =>
      e.tipoDocumento.toLowerCase().includes(termino) ||
      e.numeroDocumento.toLowerCase().includes(termino) ||
      e.nombres.toLowerCase().includes(termino) ||
      e.apellidos.toLowerCase().includes(termino) ||
      e.registroProfesional.toLowerCase().includes(termino) ||
      e.especializacion.nombre.toLowerCase().includes(termino)
    );
  }
}
