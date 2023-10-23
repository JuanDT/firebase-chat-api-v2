import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { UserService } from 'src/app/auth/user.service';
import { Auth, getAuth } from '@angular/fire/auth';
import { Mensaje } from 'src/app/model/mensaje';
import { timestamp } from 'rxjs';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { ChatServiceService } from '../chat.service.service';
import { AmigosService } from 'src/app/amigos/amigos-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentUser: any;
  nuevoMensaje: string = '';
  selectedUid!: string | null;
  info: { chatId: string; mensajes: Mensaje[]; }[] = [];

  mensajes: Mensaje[] = [
    {
    id: '',
    remitente: '',
    contenido: '',
    fechaEnvio: serverTimestamp(),
    }
  ];

  constructor(private authService: UserService, private auth: Auth, private chatService: ChatServiceService, private amigosService: AmigosService) { 
    this.amigosService.selectedUid$.subscribe((uid) => {
      this.selectedUid = uid;
    });
    
    
  }

  ngOnInit(): void {
    const user = getAuth();
    const currentUser = user.currentUser
    if(currentUser){
      this.currentUser = currentUser.uid
    }   
    this.cargarChat()
  }

  enviarMensaje() {
   
    if (this.selectedUid) {

      for (let i = 0; i < this.info.length; i++) {
        const chatUid = this.info[i].chatId;
        console.log('Chat UID del chat en la posición', i, ':', chatUid);
      
      if (chatUid) {
        const chatId = chatUid;
        const remitente = this.currentUser.uid; 
        const contenido = this.nuevoMensaje;
  
        this.chatService.enviarMensaje(chatId, this.currentUser, contenido);
        console.log("se envio el mensaje")
        this.nuevoMensaje = '';
      }
    }
      console.log("hay uid No se envio el mensaje")
    }
    console.log("No se envio el mensaje")
  }
  

async cargarChat() {
  if(this.selectedUid){ 
    try {
    this.info = await this.chatService.cargarMensajes(this.currentUser, this.selectedUid);
    console.log(this.info.length)
   } catch (error) {
    console.error('Error al cargar mensajes:', error);
  }
}
}

}
