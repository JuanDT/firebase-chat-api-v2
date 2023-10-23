import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Usuario } from 'src/app/model/usuario';
import { AmigosService } from 'src/app/amigos/amigos-service.service';
import { ChatComponent } from 'src/app/chat/chat/chat.component';

@Component({
  selector: 'app-mis-amigos',
  templateUrl: './mis-amigos.component.html',
  styleUrls: ['./mis-amigos.component.css']
})
export class MisAmigosComponent implements OnInit {


  amigos: Usuario[] = [];
  userUid:string = '';
  amigoSeleccionado!: Usuario | null;
  searchTerm: string = '';



  constructor(private amigosService: AmigosService,private  chatComponent: ChatComponent) { 
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

  seleccionarAmigo(amigo: Usuario) {
    this.amigoSeleccionado = amigo;
    this.amigosService.setSelectedUid(amigo.uid);
    this.chatComponent.cargarChat()

  }

  saveToLocalStorage() {
    localStorage.setItem('amigos', JSON.stringify(this.amigos));
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
