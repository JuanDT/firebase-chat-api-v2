import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { UserService } from 'src/app/auth/user.service';
import { Auth, getAuth } from '@angular/fire/auth';
import { Mensaje } from 'src/app/model/mensaje';
import { timestamp } from 'rxjs';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { ChatServiceService } from '../chat.service.service';
import { AmigosService } from 'src/app/amigos/amigos-service.service';
import { Chat } from 'src/app/model/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentUser!: string;
  nuevoMensaje: string = '';
  selectedUid!: string | null;
  chats: Chat[] = [];
  mensajes: Mensaje[] = [];



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
      const chat = this.chats.find((chat) => chat.id);
      console.log("chatId"+chat?.id)
      if (chat) {
        const chatId = chat.id;
        const remitente = this.currentUser;
        const contenido = this.nuevoMensaje;
  
        this.chatService.enviarMensaje(chatId, remitente, contenido);
        console.log("Se envió el mensaje");
        this.nuevoMensaje = '';
        this.cargarChat()
      } else {
        console.log("No se envió el mensaje: No se encontró el chat seleccionado.");
      }
    } else {
      console.log("No se envió el mensaje: No se ha seleccionado un chat.");
    }
  }
  

async cargarChat() {
  if(this.selectedUid){ 
    try {
    this.chats = await this.chatService.cargarMensajes(this.currentUser, this.selectedUid);
    const chat = this.chats.find((chat) => chat.id);
    const chatId = chat?.id;
    if(chatId){
      this.mensajes = await this.chatService.obtenerMensajesDelChat(chatId)
      console.log("tamaño:"+this.chats.length, this.mensajes)
    }   
    this.mostrarMensajesEnConsola()
   } catch (error) {
    console.error('Error al cargar mensajes:', error);
  }
}
}



mostrarMensajesEnConsola() {
  this.chats.forEach((chat: Chat) => {
    console.log(`Chat ID: ${chat.id}`);
    if(chat.participantes.length >= 1){
     console.log("hay participantes")
    }
    if(chat.mensajes.length >= 1){
      console.log("hay mensajes")

    }
    chat.participantes.forEach((participantes) => {
      console.log(`Remitente: ${participantes}`);
      console.log('-------------------------');
    });
  });
}




}
