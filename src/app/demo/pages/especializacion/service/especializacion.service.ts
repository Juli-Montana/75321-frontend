import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendService } from 'src/app/services/backend.service';
import { Especializacion } from '../../medico/models/especializacion';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'medico';

  constructor(private readonly backendService: BackendService) { }

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar').pipe(
      map((medicos: any[]) => {
        const especializacionesUnicas = new Map<number, Especializacion>();

      medicos.forEach((m) => {
        if (m.especializacion && m.especializacion.id) {
          especializacionesUnicas.set(m.especializacion.id, m.especializacion);
        }
      });

      return Array.from(especializacionesUnicas.values());
      })
    );
  }


  guardarEspecializacion(especializacion: Especializacion): Observable<any> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', especializacion);
  }

}
