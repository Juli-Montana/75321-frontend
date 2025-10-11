import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Cita } from '../model/cita';
import { environment } from '../../../../../environments/environment';
import { RespuestaRS } from '../model/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'cita';

  constructor(private readonly backendService: BackendService) { }

  listarCitas(): Observable<Cita[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }

  guardarCita(cita: Cita): Observable<RespuestaRS> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', cita);
  }
}
