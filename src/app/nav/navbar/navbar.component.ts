import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userLogged: any;
 

  constructor(private auth: Auth, private userService: UserService, private router: Router, private modalService: NgbModal) {
        
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    
    if (userData) {

      this.userLogged = JSON.parse(userData);
    } else {

      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.userLogged = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          };
          
          localStorage.setItem('userData', JSON.stringify(this.userLogged));
        }
      });
    }
  }

  openConfirmationModal() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.result.then((result) => {
      if (result === 'Cerrar') {
        // El usuario confirmó, cierra la sesión
        this.logout();
      }
    }).catch((error) => {
      console.log(`Modal cerrado con resultado: ${error}`);
    });
  }

  confirmLogout() {
    const confirmLogout = window.confirm('¿Deseas cerrar sesión?');
    if (confirmLogout) {
      // El usuario confirmó, cierra la sesión
      this.logout();
    }
  }


  logout() {
    this.userService.logout();
    this.auth.signOut()
      .then(() => {

        localStorage.removeItem('userData');
        this.router.navigate(['/auth/login']);
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }
}
