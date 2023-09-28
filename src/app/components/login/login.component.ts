import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Auth, fetchSignInMethodsForEmail, sendPasswordResetEmail } from '@angular/fire/auth';

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
  isForgotPasswordModalOpen: boolean = false; // Controla la visibilidad de la ventana emergente
  forgotPasswordError: string | null = null; // Almacena el mensaje de error
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
  this.forgotPasswordError = null; // Restablece el mensaje de error
  this.passwordSendSucces = null
}

  sendPasswordResetEmail2(email: string) {
    this.forgotPasswordError = null; // Restablece el mensaje de error
    this.passwordSendSucces = null;
    this.isOkButtonEnable= false;
    this.isSendButtonEnable= true;
    this.isCancelButtonEnable = true;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Verifica si el correo está asociado a una cuenta
    
    if (!email.match(emailRegex)) {
      // El correo electrónico no es válido
      this.forgotPasswordError = 'Por favor, ingrese una dirección de correo electrónico válida.';
    } else {

     fetchSignInMethodsForEmail(this.auth,email)
      .then((methods) => {
        if (methods.length === 0) {
          // No se encontró una cuenta con este correo
          this.forgotPasswordError = 'No se encontró una cuenta con este correo electrónico.';
        } else {
          // Envia el correo de restablecimiento de contraseña
          
            sendPasswordResetEmail(this.auth,email)
            .then(() => {
              // Éxito, el correo se envió correctamente
              // Puedes mostrar un mensaje de éxito aquí si lo deseas
              this.isOkButtonEnable = true;
              this.isSendButtonEnable = false;
              this.isCancelButtonEnable= false;
              this.passwordSendSucces = 'Correo de restablecimiento de contraseña enviado con éxito.';
                         
            })
            .catch((error) => {
              // Error al enviar el correo de restablecimiento de contraseña
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
                this.router.navigate(['/main']);
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
      .then(response => {
        console.log(response);
        this.router.navigate(['/main']);
      })
      .catch(error => console.log(error))
  }

}
