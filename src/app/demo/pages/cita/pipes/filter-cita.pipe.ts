import { Pipe, PipeTransform } from '@angular/core';
import { Cita } from '../model/cita';

@Pipe({
  name: 'filterCitas',
  standalone: true
})
export class FilterCitasPipe implements PipeTransform {
  transform(citas: Cita[], filtro: string = ''): Cita[] {
    if (!citas) return [];
    if (!filtro.trim()) return citas;

    const termino = filtro.toLowerCase();

    return citas.filter(e =>
      e.paciente?.nombres.toLowerCase().includes(termino) ||
      e.paciente?.apellidos.toLowerCase().includes(termino) ||
      e.medico?.nombres.toLowerCase().includes(termino) ||
      e.medico?.apellidos.toLowerCase().includes(termino) ||
      e.estado.toLowerCase().includes(termino) ||
      e.motivo.toLowerCase().includes(termino)
    );
  }
}
