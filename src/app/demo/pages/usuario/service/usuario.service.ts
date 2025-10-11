import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Usuario } from '../model/usuario';
import { environment } from '../../../../../environments/environment';
import { RespuestaRS } from '../model/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'users';

  constructor(private readonly backendService: BackendService) {}

  listarUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'all');
  }

  guardarUsuario(usuario: Usuario): Observable<RespuestaRS> {   
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<RespuestaRS> {   
    return this.backendService.post(this.apiUrl, this.endpoint, 'actualizar', usuario);
  }
}
