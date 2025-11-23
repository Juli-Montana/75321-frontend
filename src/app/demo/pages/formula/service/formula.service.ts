import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { FormulaMedica } from '../models/formula';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'receta';

  constructor(private readonly backendService: BackendService) { }

  listarFormulasMedicas(): Observable<FormulaMedica[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }

  guardarFormulaMedica(formulaMedica: FormulaMedica): Observable<any> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', formulaMedica);
  }

  actualizarFormulaMedica(formulaMedica: FormulaMedica): Observable<any> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'actualizar', formulaMedica);
  }

}
