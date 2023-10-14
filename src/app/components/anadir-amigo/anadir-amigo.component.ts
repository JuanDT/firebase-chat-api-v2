import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/model/usuario';
import { AmigosService } from 'src/app/services/amigos-service.service';

@Component({
  selector: 'app-anadir-amigo',
  templateUrl: './anadir-amigo.component.html',
  styleUrls: ['./anadir-amigo.component.css']
})
export class AnadirAmigoComponent implements OnInit {

 searchTerm:string = '';
 searchResults: Usuario[] = [];

  constructor(public activeModal: NgbActiveModal, private amigosService: AmigosService) { }

  ngOnInit(): void {
  }

  async searchUsers() {
    const user = getAuth()
    const currentUser = user.currentUser

    if(currentUser){

   if(this.searchTerm == ''){
    this.searchResults = []
   }else{
    this.searchResults = await this.amigosService.searchUsers(this.searchTerm, currentUser.uid)

   }

    }
  }

 

  addFriend(){

  }
}
