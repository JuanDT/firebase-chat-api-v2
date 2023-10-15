import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnadirAmigoComponent } from 'src/app/components/anadir-amigo/anadir-amigo.component';
import { SolicitudAmistad } from 'src/app/model/solicitudAmistad';
import { Usuario } from 'src/app/model/usuario';
import { AmigosService } from 'src/app/services/amigos-service.service';


@Component({
  selector: 'app-lista-amigos',
  templateUrl: './lista-amigos.component.html',
  styleUrls: ['./lista-amigos.component.css']
})
export class ListaAmigosComponent implements OnInit {
  searchTerm: string = '';
  friends: any[] = [];
  usuarios: any[] = [];
  amigos: Usuario[] = [];
  solicitudes: { solicitud: SolicitudAmistad; remitente: Usuario }[] = [];
  searchResults: Usuario[] = [];
  activeTab = 'amigos';
  userUid:string = '';
 
  showModal: boolean = false;

  constructor(private amigosService: AmigosService, private firestore: Firestore, private modalService: NgbModal) {
    const amigosData = localStorage.getItem('amigos');
  if (amigosData) {
    this.amigos = JSON.parse(amigosData);
  }
  }

  async ngOnInit() {
    const user = getAuth();
    const currentUser = user.currentUser;
  
    if (currentUser) {
      this.amigos = await this.amigosService.getFriends(currentUser.uid);
      this.solicitudes = await this.amigosService.getFriendRequests(currentUser.uid);
      this.userUid = currentUser.uid;
      this.saveToLocalStorage();
     
    } else {
      const storedFriends = localStorage.getItem('amigos');
      const storedSolicitudes = localStorage.getItem('solicitudes');
      if (storedFriends && storedSolicitudes) {
        this.amigos = JSON.parse(storedFriends);
        this.solicitudes = JSON.parse(storedSolicitudes);
      }
    }
  }
  
  saveToLocalStorage() {
    localStorage.setItem('amigos', JSON.stringify(this.amigos));
    localStorage.setItem('solicitudes', JSON.stringify(this.solicitudes));
  }
  
  async removeFriend(friend: Usuario) {
   
    this.saveToLocalStorage();
  }
  async listFriends() {
    this.amigos = await this.amigosService.getFriends(this.userUid);
  }

  async loadFriendRequests() {
    if (this.activeTab === 'solicitudes') {
      this.solicitudes = await this.amigosService.getFriendRequests(this.userUid);
    }
  }

  async searchFriends() {

   if(this.searchTerm == ''){

    const user = getAuth()
    const currentUser = user.currentUser
    if(currentUser){
    this.amigos = await this.amigosService.getFriends(currentUser.uid);
    }

   }else{
    const user = getAuth()
    const currentUser = user.currentUser

    if(currentUser){
      this.amigos = await this.amigosService.searchFriends (currentUser.uid, this.searchTerm)
    }
   }  
  }

  openAddFriendModal() {
    this.modalService.open(AnadirAmigoComponent);
    
  }

  closeAddFriendModal() {
    this.showModal = false;
  }

  addFriend(){

  }

  acceptFriendRequest(senderUid: string){
     this.amigosService.acceptFriendRequest(this.userUid, senderUid)
     this.listFriends()
     this.loadFriendRequests()
     
  }

  rejectFriendRequest(senderUid: string){

  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }
  
}
