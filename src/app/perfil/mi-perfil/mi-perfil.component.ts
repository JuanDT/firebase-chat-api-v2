import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  userPhotoURL: any; 
  userNickname: string | any; 
  userPassword = ''; 
  userCorreo: string | any;
  editMode = false; 
  cambioContrasenaEnviado: boolean | undefined;

  constructor(private auth: Auth, private userService: UserService){
    this.cambioContrasenaEnviado = false;
    console.log("photo: "+this.userPhotoURL)
  }

  ngOnInit() {
    const userData = localStorage.getItem('userData');

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      this.userPhotoURL = parsedUserData.photoURL;
      this.userCorreo = parsedUserData.email;
      this.userNickname = parsedUserData.displayName;
      this.userPassword = '********'; 
    } else {

      this.userPhotoURL = this.auth.currentUser?.photoURL;
      this.userCorreo = this.auth.currentUser?.email;

        const user = this.userService.getUserLogged()
        this.userNickname = user.nickname;
        this.userPassword = '********';
        
        const userToStore = {
          photoURL: this.userPhotoURL,
          email: this.userCorreo,
          nickname: this.userNickname
        };
        localStorage.setItem('userData', JSON.stringify(userToStore));    
    }
    
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  guardarCambios() {
    
  }

  actualizarPerfil() {
    if (!this.userNickname) {
      console.error('El nickname no puede estar vacío.');
      return;
    }
  
    this.userService.actualizarNickname(this.userNickname)
      .then(() => {
        console.log('Nickname actualizado con éxito.');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.nickname = this.userNickname;
        localStorage.setItem('userData', JSON.stringify(userData));
      })
      .catch((error: any) => {
        console.error('Error al actualizar el nickname:', error);
      });
  }

  solicitarCambioContrasena() {
    this.userService.sendPasswordResetEmail(this.userCorreo).then(() => {
      console.log('Correo de restablecimiento de contraseña enviado con éxito.');
      this.cambioContrasenaEnviado = true;
      
      setTimeout(() => {
        this.cambioContrasenaEnviado = false;
        this.editMode = false;
      }, 5000); 
    })
    .catch((error) => {
      console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
    });
  }
}
