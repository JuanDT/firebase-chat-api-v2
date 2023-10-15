import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Auth, fetchSignInMethodsForEmail, sendPasswordResetEmail } from '@angular/fire/auth';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  loginError: string | null = null;
  email: string = '';
  password: string = '';
  loginError2: string | null = null;


  isOkButtonEnable: boolean = false;
  isSendButtonEnable: boolean = true;
  isCancelButtonEnable: boolean = true;
  isForgotPasswordModalOpen: boolean = false; 
  forgotPasswordError: string | null = null; 
  passwordSendSucces: string | null = null;


 
  constructor(
    private userService: UserService,
    private router: Router,
    private auth: Auth
  ) {
    
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]), 
      password: new FormControl('', Validators.required) 
    })
  }

 // Método para abrir la ventana emergente
 openForgotPasswordModal() {
  this.isForgotPasswordModalOpen = true;
  this.forgotPasswordError = null; 
  this.passwordSendSucces = null
}

  sendPasswordResetEmail2(email: string) {
    this.forgotPasswordError = null; 
    this.passwordSendSucces = null;
    this.isOkButtonEnable= false;
    this.isSendButtonEnable= true;
    this.isCancelButtonEnable = true;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    
    
    if (!email.match(emailRegex)) {
     
      this.forgotPasswordError = 'Por favor, ingrese una dirección de correo electrónico válida.';
    } else {

     fetchSignInMethodsForEmail(this.auth,email)
      .then((methods) => {
        if (methods.length === 0) {
         
          this.forgotPasswordError = 'No se encontró una cuenta con este correo electrónico.';
        } else {
          
          
            sendPasswordResetEmail(this.auth,email)
            .then(() => {
              
              this.isOkButtonEnable = true;
              this.isSendButtonEnable = false;
              this.isCancelButtonEnable= false;
              this.passwordSendSucces = 'Correo de restablecimiento de contraseña enviado con éxito.';
                         
            })
            .catch((error) => {
             
              console.error('Error al enviar el correo de restablecimiento:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error al verificar el correo:', error);
      });
    }
  }

 // Método para cerrar la ventana emergente
 closeForgotPasswordModal() {
  this.isForgotPasswordModalOpen = false;
  this.email= '';
}

enabledOkButton(){
  this.isOkButtonEnable = false;
  this.isSendButtonEnable = true;
  this.isCancelButtonEnable = true;
  this.closeForgotPasswordModal();
  this.email = '';
}
  ngOnInit(): void {
    
  }

  
  onSubmit() {

          this.loginError = null;
          if (this.formLogin.valid) {
            this.userService.login(this.formLogin.value)
              .then(response => {
                console.log(response);
                this.router.navigate(['/dashboard']);
              })
              .catch(error => {
                console.log(error);
                if (error.status === 401) {
                  this.loginError = 'Contraseña o correo incorrecto.';
                } else if (error.status === 404) {
                  this.loginError = 'No se encontró una cuenta con este correo electrónico.';
                } else {
                  this.loginError = 'Contraseña o correo incorrecto.';
                }
              });
          } else {
            this.loginError = 'Por favor, completa los campos requeridos.';
          }   
  }
  
  onClick() {
    this.userService.loginWithGoogle()
      .then((response) => {
        console.log(response);
  
        const user = this.auth.currentUser; 
  
        if (user) {
          const usuario: Usuario = {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.displayName || '',
            amigos: [], 
            solicitudesAmistad: [], 
            chats: [],
          };
          console.log(usuario.uid, usuario.email, usuario.displayName)
         
          this.userService.saveUser(usuario)
          this.router.navigate(['/dashboard']);
        } else {
          console.error('No se pudo obtener el usuario autenticado.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
