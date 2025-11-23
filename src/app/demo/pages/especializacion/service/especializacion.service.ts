import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Especializacion } from '../model/especializacion';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'especializacion';

  constructor(private readonly backendService: BackendService) { }

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }

  guardarEspecializacion(especializacion: Especializacion): Observable<any> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', especializacion);
  }

  actualizarEspecializacion(especializacion: Especializacion): Observable<any> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'actualizar', especializacion);
  }

}
