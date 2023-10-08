import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  userLogged: any; 

  constructor(private auth: Auth, private userService: UserService, private router: Router) { 
    this.userLogged =  this.auth.currentUser;
  }

  ngOnInit(): void {
  }

  logout(){
    this.userService.logout
    this.auth.signOut()
      .then(() => {
        this.router.navigate(['/auth/login']);
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }

}
