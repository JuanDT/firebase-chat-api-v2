import {  Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Auth, User, getAuth, provideAuth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { getStorage,  ref, uploadBytes } from 'firebase/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  implements OnInit {
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
      displayName: new FormControl('',[Validators.required, Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      photo: new FormControl()
    });

    
  }

  ngOnInit(): void {
    
  }

  closePopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['/login']);
  }
  
  

  onSubmit() {
    this.registrationError = null;
    this.passwordLengthError = null;

    const auth = getAuth();
    const email = this.formReg.value.email;
    const password = this.formReg.value.password;
    const displayName = this.formReg.value.displayName;
    const photo = this.formReg.value.photo;
    console.log('Estado del formulario:', this.formReg.value);


    if (!this.userService.checkPasswordLength(password)) {
      this.showPasswordLengthError = true;
      this.passwordLengthError = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (this.formReg.valid) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user as User;

          updateProfile(user, { displayName: displayName })
            .then(() => {
              if (photo) {
                console.log("hay imagen")

                

                console.log("storage")
                const storage = getStorage();
                console.log("storage2")
                const storageRef = ref(storage, `profile_photos/${user.uid}`);
               
                uploadBytes(storageRef, photo).then(() => {

                  console.log('Usuario registrado con nombre y foto de perfil:', user);
                  this.showSuccessPopup = true;
                  this.successMessage = 'Registrado correctamente';
                  console.log("hay imagen")
                  
                });
              } else {

                console.log('Usuario registrado con nombre:', user);
                this.showSuccessPopup = true;
                this.successMessage = 'Registrado correctamente';
                console.log("No hay imagen")
              }
            })
            .catch((error) => {
              console.error('Error al actualizar el perfil:', error);
              this.registrationError = 'Este usuario o correo ya se encuentra registrado.';
            });
        })
        .catch((error) => {
          console.error('Error durante el registro:', error);
          this.registrationError = 'Este usuario o correo ya se encuentra registrado.';
        });
    } else {
      this.registrationError = 'Valide los campos ingresados.';
    }
  }

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
  const file = inputElement.files?.[0]; 

  if (file) {
    this.formReg.patchValue({ photo: file }); 
  }
  }

  onDeletePhoto() {
   
    this.formReg.patchValue({ photo: null, photoUrl: null });
  }

  onResetFile() {

    this.formReg.patchValue({ photo: null, photoUrl: null });
    
    const fileInput = document.getElementById('fotoPerfil') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
