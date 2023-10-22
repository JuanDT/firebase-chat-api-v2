import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Usuario } from 'src/app/model/usuario';
import { AmigosService } from 'src/app/services/amigos-service.service';

@Component({
  selector: 'app-mis-amigos',
  templateUrl: './mis-amigos.component.html',
  styleUrls: ['./mis-amigos.component.css']
})
export class MisAmigosComponent implements OnInit {


  amigos: Usuario[] = [];
  userUid:string = '';
  amigoSeleccionado: Usuario | null = null;
  searchTerm: string = '';



  constructor(private amigosService: AmigosService) { 
    const amigosData = localStorage.getItem('amigos');
  if (amigosData) {
    this.amigos = JSON.parse(amigosData);
  }
  }

  async ngOnInit(): Promise<void> {
    const user = getAuth();
    const currentUser = user.currentUser;
  
    if (currentUser) {
      this.amigos = await this.amigosService.getFriends(currentUser.uid);
      this.userUid = currentUser.uid;
      this.saveToLocalStorage();
     
    } else {
      const storedFriends = localStorage.getItem('amigos');
      const storedSolicitudes = localStorage.getItem('solicitudes');
      if (storedFriends && storedSolicitudes) {
        this.amigos = JSON.parse(storedFriends);
      }
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('amigos', JSON.stringify(this.amigos));
  }

  seleccionarAmigo(amigo: Usuario) {
    this.amigoSeleccionado = amigo;

    // Aquí puedes cargar el chat del amigo en la columna izquierda,
    // tal como lo haces actualmente en el componente 'app-chat'.
    // Puedes usar la variable 'amigoSeleccionado' para cargar el chat
    // correspondiente en base al amigo seleccionado.
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

}
