import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Auth, User, getAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

   displayName: string | null = null;

   currentUser: User | null = null; // Objeto para almacenar el usuario actual


  

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: Auth
  ) { 
    this.ngOnInit()
  }

 
  ngOnInit(): void {
   // Obtener la instancia de Firebase Authentication
   const auth = getAuth();

   // Verificar si hay un usuario autenticado
   const user = auth.currentUser;

   if (user) {
     // El usuario está autenticado, se asigna al objeto currentUser
     this.currentUser = user;
     
     // Obtener el displayName y almacenarlo en la variable nickName
     this.displayName = user.displayName;
     
     // Ahora puedes acceder al displayName como nickName
     console.log('Usuario actual:', this.currentUser);
     console.log('Nickname:', this.displayName);
   } else {
     // No hay usuario autenticado
     this.currentUser = null;
   }
 }
  

  onClick() {  

      
      this.userService.logout();
     

      this.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }
  

}
