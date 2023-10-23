import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { Auth, User, getAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

   displayName: string | null = null;

   currentUser: User | null = null; 


  

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: Auth
  ) { 
    this.ngOnInit()
  }

 
  ngOnInit(): void {
   const auth = getAuth();

   const user = auth.currentUser;

   if (user) {
     this.currentUser = user;
     
     this.displayName = user.displayName;
     
     console.log('Usuario actual:', this.currentUser);
     console.log('Nickname:', this.displayName);
   } else {
     this.currentUser = null;
   }
 }
  

  onClick() {  

      
      this.userService.logout();
      this.auth.signOut()
      .then(() => {
        this.router.navigate(['/auth/login']);
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }
  

}
