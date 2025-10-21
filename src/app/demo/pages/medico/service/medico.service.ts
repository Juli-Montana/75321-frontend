import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'medico';

  constructor(private readonly backendService: BackendService) {}

  listarMedicos(): Observable<Medico[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }

  guardarMedicos(medico: Medico): Observable<Medico> {
    return this.backendService.post<Medico>(this.apiUrl,this.endpoint,'guardar',medico);
  }

  actualizarMedico(medico: Medico): Observable<Medico> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', medico);
  }
  
}
