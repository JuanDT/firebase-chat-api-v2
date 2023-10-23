import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudAmistad } from 'src/app/model/solicitudAmistad';
import { Usuario } from 'src/app/model/usuario';
import { AmigosService } from 'src/app/amigos/amigos-service.service';

@Component({
  selector: 'app-anadir-amigo',
  templateUrl: './anadir-amigo.component.html',
  styleUrls: ['./anadir-amigo.component.css']
})
export class AnadirAmigoComponent implements OnInit {

 searchTerm:string = '';
 searchResults: Usuario[] = [];

 listaAmigos: Usuario [] = [];
 reicipentUid: string = '';
 senderUid: string = '';
 currentUserUid:string = '';
 friendFriendReq: SolicitudAmistad [] = [];
 hasPendingReq: boolean = false;
 sentConfirmation: boolean = false;
 buscado: boolean = false;
 userStates: { [uid: string]: { isFriend: boolean, hasPendingReq: boolean, sentConfirmation: boolean } } = {};

  constructor(public activeModal: NgbActiveModal, private amigosService: AmigosService) { }

  ngOnInit(): void {

    const user = getAuth();
    const currentUser = user.currentUser
    if(currentUser){
      this.currentUserUid = currentUser.uid
    }
  }

   async searchUsers() {
    const user = getAuth();
    const currentUser = user.currentUser;

    if (currentUser) {
      this.senderUid = currentUser.uid;
      this.listaAmigos = await this.amigosService.getFriends(currentUser.uid);
      if (this.searchTerm == '') {
        this.searchResults = [];
      } else {
        this.searchResults = await this.amigosService.searchUsers(this.searchTerm, currentUser.uid);
      }
      this.sentConfirmation = false;
      this
      
         
        this.userStates = {};
        this.buscado = true;
       
        this.searchResults.forEach((amigo) => {
          this.userStates[amigo.uid] = {
            isFriend: this.isFriend(amigo),
            hasPendingReq: false,
            sentConfirmation: false,
          };
        });this.hasPendingReq = false;
    }
  }

  search(){
    this.buscado = false;
  }


  async addFriend(amigo: Usuario) {
    const hasPendingRequest = await this.amigosService.hasPendingFriendRequest(this.currentUserUid, amigo.uid);
    const userState = this.userStates[amigo.uid];
  
    if (hasPendingRequest) {
      userState.hasPendingReq = true;
    } else {
      this.amigosService.sendFriendRequest(this.senderUid, amigo.uid);
      userState.sentConfirmation = true;
    }
  }

  
  isFriend(amigo: Usuario): boolean {
    
      for (const usuario2 of this.listaAmigos) {
        if (amigo.uid === usuario2.uid) {
          return true;
        }
      }  
    return false;
  }

  async hasPendingFriendRequest(amigo: Usuario): Promise<boolean> {
    try {
      const aux = await this.amigosService.hasPendingFriendRequest(this.currentUserUid, amigo.uid);
      console.log(aux)

      return aux;
    } catch (error) {
      console.error('Error al verificar las solicitudes de amistad del amigo:', error);
      return false; 
    }
  }
  
   closeModal(){
    this.activeModal.close('cerrar')
    this.sentConfirmation = false;
    this.hasPendingReq = false;
   }
}
