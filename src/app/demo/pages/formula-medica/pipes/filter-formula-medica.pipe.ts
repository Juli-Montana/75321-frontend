import { Pipe, PipeTransform } from '@angular/core';
import { FormulaMedica } from '../model/formula-medica';

@Pipe({
  name: 'filterFormulaMedica',
  standalone: true
})
export class FilterFormulaMedicaPipe implements PipeTransform {
  transform(FormulaMedica: FormulaMedica[], filtro: string = ''): FormulaMedica[] {
    if (!FormulaMedica) return [];
    if (!filtro.trim()) return FormulaMedica;

    const termino = filtro.toLowerCase();

    return FormulaMedica.filter(e =>
      e.cita.paciente.nombres.toLowerCase().includes(termino) ||
      e.medicamento.nombre.toLowerCase().includes(termino) ||
      e.dosis.toLowerCase().includes(termino) ||
      e.indicaciones.toLowerCase().includes(termino)
    );
  }
}
