import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  userPhotoURL: any; 
  userNickname: string | any; // Nombre de usuario (cargar desde el servicio)
  userPassword = ''; // Contraseña (cargar desde el servicio)

  editMode = false; // Modo de edición (inicialmente desactivado)

  constructor(private auth: Auth){
  }


  ngOnInit() {
    this.userPhotoURL = this.auth.currentUser?.photoURL
    this.userNickname = this.auth.currentUser?.displayName
    this.userPassword = '********'
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  guardarCambios() {
    // Lógica para guardar los cambios en el perfil (actualizar en el servicio)
    // Debes implementar esta función según tus necesidades
  }

  solicitarCambioContrasena() {
    // Lógica para solicitar cambio de contraseña (enviar solicitud al servicio)
    // Debes implementar esta función según tus necesidades
  }
}
