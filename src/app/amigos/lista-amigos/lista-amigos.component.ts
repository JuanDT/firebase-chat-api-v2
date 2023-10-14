import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnadirAmigoComponent } from 'src/app/components/anadir-amigo/anadir-amigo.component';
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
      this.saveFriendsToLocalStorage();
    } else {
      // Recuperar la lista de amigos desde el localStorage si el usuario no está autenticado
      const storedFriends = localStorage.getItem('amigos');
      if (storedFriends) {
        this.amigos = JSON.parse(storedFriends);
      }
    }
  }
  
  saveFriendsToLocalStorage() {
    localStorage.setItem('amigos', JSON.stringify(this.amigos));
  }
  
  async removeFriend(friend: Usuario) {
    // Implementa la lógica para eliminar a un amigo
    // Después de eliminar, guarda la lista actualizada en el localStorage
    this.saveFriendsToLocalStorage();
  }
  async listFriends(userId: string) {
    this.amigos = await this.amigosService.getFriends(userId);
  }

  async searchFriends() {
   
  }

  openAddFriendModal() {
    this.modalService.open(AnadirAmigoComponent);
    
  }

  closeAddFriendModal() {
    this.showModal = false;
  }

  addFriend(){

  }

  
}
