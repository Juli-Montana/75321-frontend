import { Pipe, PipeTransform } from '@angular/core';
import { Especializacion } from '../model/especializacion';

@Pipe({
  name: 'filterEspecializaciones',
  standalone: true
})
export class FilterEspecializacionesPipe implements PipeTransform {
  transform(especializaciones: Especializacion[], filtro: string = ''): Especializacion[] {
    if (!especializaciones) return [];
    if (!filtro.trim()) return especializaciones;

    const termino = filtro.toLowerCase();

    return especializaciones.filter(e =>
      e.nombre.toLowerCase().includes(termino) ||
      e.codigoEspecializacion.toLowerCase().includes(termino)
    );
  }
}
