import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
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

  constructor(private amigosService: AmigosService, private firestore: Firestore) {}

  async ngOnInit() {
    
    const user = getAuth()
    
    const currentUser = user.currentUser

    if(currentUser){
      this.amigos = await this.amigosService.getFriends(currentUser.uid);

    }

    
  }

  async searchFriends() {
   
  }

  openAddFriendModal() {
    // Implementa la lógica para abrir un modal o ventana para agregar amigos
  }

  async removeFriend(friend: Usuario) {
   
  }
}
