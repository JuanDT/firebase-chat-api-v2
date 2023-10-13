import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-amigos',
  templateUrl: './lista-amigos.component.html',
  styleUrls: ['./lista-amigos.component.css']
})
export class ListaAmigosComponent implements OnInit {
  searchTerm: string = '';
  friends: any[] = [];

  constructor() {}

  ngOnInit() {
    // Aquí puedes cargar la lista de amigos del usuario actual
    // Debes obtener la lista de amigos y asignarla a this.friends
  }

  searchFriends() {
    // Implementa la lógica para buscar amigos según el término de búsqueda (this.searchTerm)
    // Actualiza this.friends con los resultados
  }

  openAddFriendModal() {
    // Implementa la lógica para abrir un modal o ventana para agregar amigos
  }

  removeFriend(friend: any) {
    // Implementa la lógica para eliminar a un amigo
  }
}
