import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css']
})
export class SobreNosotrosComponent implements OnInit {

   activeUser:boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const user = getAuth();
    const currentUser = user.currentUser
    if(currentUser){
         this.activeUser = true
    }   
  }

  onClick(){
    if(this.activeUser){
      this.router.navigate(['/dashboard/main']);

    }else{
      this.router.navigate(['/']);

    }
  }

}
