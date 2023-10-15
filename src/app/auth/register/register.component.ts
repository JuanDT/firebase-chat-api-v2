import {  Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Auth, User, getAuth, provideAuth, createUserWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { getStorage,  ref, uploadBytes } from 'firebase/storage';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/model/usuario';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  implements OnInit {
  formReg: FormGroup;
  formData: FormData = new FormData();
  registrationError: string | null = null;
  passwordLengthError: string | null = null;
  showPasswordLengthError = false;

  showSuccessPopup = false;
  successMessage: string = '';

  file: any;


  constructor(
    private userService: UserService,
    private router: Router,
    private auth: Auth
  ) {
    
    this.formReg = new FormGroup({
      displayName: new FormControl('',[Validators.required, Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]), 
    });

    
  }

  ngOnInit(): void {
    
  }

  closePopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['auth/login']);
  }
  
  

  onSubmit() {
    this.registrationError = null;
    this.passwordLengthError = null;

    const auth = getAuth();
    const email = this.formReg.value.email;
    const password = this.formReg.value.password;
    const displayName = this.formReg.value.displayName;
    const photo = this.formData?.get('photo');
    console.log('Estado del formulario:', this.formReg.value, "uid");

    if (!this.userService.checkPasswordLength(password)) {
      this.showPasswordLengthError = true;
      this.passwordLengthError = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (this.formReg.valid) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user as User;

          const usuario: Usuario = {
            uid: user.uid,
            displayName: displayName,
            email: email,
            amigos: [], 
            solicitudesAmistad: [], 
            chats: [],
          };
          console.log(usuario.uid, usuario.email, usuario.displayName)
         
          this.userService.saveUser(usuario)
          
         

          updateProfile(user, { displayName: displayName })
            .then(async () => {
              if (photo) {
                console.log("hay imagen")
                const app = initializeApp(environment.firebase)
                console.log("storage")
                const storage = getStorage(app);
                console.log("storage2")
                const storageRef = ref(storage, `profile_photos/${user.uid}`);
                const photoBlob = new Blob([photo as BlobPart], { type: 'image/jpeg' }); 

                uploadBytes(storageRef, photoBlob).then(() => {

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
      
      this.file = event.target.files[0]; 
      
      this.formData.append('photo', this.file);
      console.log("archivo"+this.file)
    
    
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
        // Maneja el error si la autenticación con Google falla
        console.log(error);
      });
  }
  
}
