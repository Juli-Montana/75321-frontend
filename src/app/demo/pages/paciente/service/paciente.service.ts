import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Paciente } from '../model/paciente';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'paciente';

  constructor(private readonly backendService: BackendService) { }

  listarPacientes(): Observable<Paciente[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }

  listarPorDocumento(numeroDocumento: string): Observable<Paciente[]> {
    return this.backendService.get(
      this.apiUrl,
      this.endpoint,
      `buscar-por-documento?numeroDocumento=${numeroDocumento}`
    );
  }

  listarOrdenadoPorNacimiento(): Observable<Paciente[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar-ordenado-nacimiento');
  }
}
