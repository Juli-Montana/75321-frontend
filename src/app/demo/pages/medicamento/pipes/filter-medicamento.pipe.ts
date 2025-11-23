import { Pipe, PipeTransform } from '@angular/core';
import { Medicamento } from '../model/medicamento';

@Pipe({
  name: 'filterMedicamentos',
  standalone: true
})
export class FilterMedicamentosPipe implements PipeTransform {
  transform(medicamentos: Medicamento[], filtro: string = ''): Medicamento[] {
    if (!medicamentos) return [];
    if (!filtro.trim()) return medicamentos;

    const termino = filtro.toLowerCase();

    return medicamentos.filter(e =>
      e.nombre.toLowerCase().includes(termino) ||
      e.descripcion.toLowerCase().includes(termino) ||
      e.presentacion.toLowerCase().includes(termino) 
    );
  }
}
