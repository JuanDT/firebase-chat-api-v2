import { Component, OnInit } from '@angular/core';
import { AmigosService } from '../../services/amigos-service.service';
import { Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-lista-amigos',
  templateUrl: './lista-amigos.component.html',
  styleUrls: ['./lista-amigos.component.css'],
})
export class ListaAmigosComponent implements OnInit {
  amigos: any[]; // Define la estructura de los amigos

  constructor(private amigosService: AmigosService, private auth: Auth) {
    this.amigos = [];
  }

  ngOnInit(): void {
    if (this.auth.currentUser?.uid) {
      this.amigosService.getListaAmigos(this.auth.currentUser.uid).subscribe((amigos) => {
        // Resto de la lógica para manejar la lista de amigos
      });
    } else {
      // Manejar el caso en el que this.auth.currentUser?.uid es undefined
    }
  }

  // Implementa funciones para aceptar solicitudes, eliminar amigos, etc.
}
