import {  Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formReg: FormGroup;
  registrationError: string | null = null;
  passwordLengthError: string | null = null;
  showPasswordLengthError = false;

  showSuccessPopup = false;
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    
    this.formReg = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {}

  closePopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['/login']);
  }
  

  onSubmit() {
    this.registrationError = null;
    this.passwordLengthError = null;
    console.log('Submit:',this.formReg);
    const password = this.formReg.value.password;
    if (!this.userService.checkPasswordLength(password)) { 
      this.showPasswordLengthError = true;
      this.passwordLengthError = 'La contraseña debe tener al menos 6 caracteres.';
      
    }
    
    if (this.formReg.valid) {
      const email = this.formReg.value.email;
      this.userService.checkEmailExists(email)
        .subscribe(emailExists => {
          console.log(emailExists);
          
          if (emailExists) {
            this.registrationError = 'Este correo ya está registrado.';
          } else {
            this.userService.register(this.formReg.value)
              .then(response =>{
                console.log(response);
                this.showSuccessPopup = true;
                console.log("Modal: "+this.showSuccessPopup)
                this.successMessage = 'Registrado correctamente';
                
              })
              .catch(error => {
                console.log(error);
                this.registrationError = 'Se produjo un error durante el registro.';
              });
          }
        }, error => {
          console.log(error);
          this.registrationError = 'Se produjo un error al verificar el correo.';
        });
    } else{
      this.registrationError = 'Valide los campos ingresados.';
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
