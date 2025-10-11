import { Component } from '@angular/core';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from './model/usuario';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  usuariosList: Usuario[] = [];
  usuarioSelected: Usuario;

  /**
   * Formulario para crear/editar usuario.
   */
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    rol: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarUsuarios();
    this.inicializarFormulario();
  }

  /**
   * Relaciona el formulario inicial con sus respectivos validadores.
   */
  inicializarFormulario() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      password: ['', [Validators.required, Validators.minLength(8)], [this.passwordAsyncValidator]],
      rol: ['', [Validators.required]],
      activo: ['']
    });
  }

  /**
   * Siempre va igual.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Validador asincrono para la contrasena.
   * @param control Validador asincrono para la contrasena.
   * @returns Validador.
   */
  passwordAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const contrasenasProhibidas = ['12345678', 'password', 'admin'];

    return of(contrasenasProhibidas.includes(control.value)).pipe(
      delay(800), // simulamos llamada a servidor
      map((invalida) => (invalida ? { passwordProhibida: true } : null))
    );
  }

  /**
   * Funcion para cargar la lista de usuarios.
   */
  listarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuariosList = data;
      },
      error: (error) => {
        console.error('Error al cargar usuarios: ', error);
      }
    });
  }

  /**
   * Funcion para cerrar el modal.
   */
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  /**
   * Abre el modal para crear o editar un usuario.
   * @param modo 'C' para crear, 'E' para editar
   */
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Usuario' : 'Editar Usuario';
    this.titleBoton = modo === 'C' ? 'Guardar Usuario' : 'Actualizar Usuario';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearUsuario');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  /**
   * Abre el modal para crear un nuevo usuario.
   */
  abrirNuevoUsuario() {
    this.usuarioSelected = new Usuario();
    // Dejamos el formulario en blanco
    this.limpiarFormulario();
    this.openModal('C');
  }

  /**
   * Limpia los campos del formulario.
   */
  limpiarFormulario() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  /**
   * Abre el modal para editar un usuario existente.
   * @param usuario Usuario a editar.
   */
  abrirEditarUsuario(usuario: Usuario) {
    this.limpiarFormulario();
    this.usuarioSelected = usuario;
    this.openModal('E');
  }

  /**
   * Funcion para guardar los datos en crear/actualizar usuario.
   */
  guardarUsuario() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
      this.usuarioService.guardarUsuario(this.form.getRawValue()).subscribe({
        next: (data) => {
          console.log(data);
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarUsuarios();
        },
        error: (error) => {
          console.error('Error al guardar usuario: ', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    } else {
      this.usuarioService.actualizarUsuario(this.form.getRawValue()).subscribe({
        next: (data) => {
          console.log(data);
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarUsuarios();
        },
        error: (error) => {
          console.error('Error al actualizar usuario: ', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    }
  }
}
