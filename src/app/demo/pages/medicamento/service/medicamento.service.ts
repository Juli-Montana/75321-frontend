import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Medicamento } from '../model/medicamento';
import { environment } from '../../../../../environments/environment';
import { RespuestaRS } from '../model/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'medicamento';

  constructor(private readonly backendService: BackendService) { }

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }

  guardarMedicamento(medicamento: Medicamento): Observable<RespuestaRS> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', medicamento);
  }

  actualizarMedicamento(medicamento: Medicamento): Observable<RespuestaRS> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'actualizar', medicamento);
  }
}
