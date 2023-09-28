import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

   email: string | null = null;

  setEmail(value: string | null) {
    this.email = value;
  }

  getEmail(): string | null {
    return this.email;
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: Auth
  ) { 
    this.email = userService.getEmail();
  }

 
  ngOnInit(): void {
   
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
