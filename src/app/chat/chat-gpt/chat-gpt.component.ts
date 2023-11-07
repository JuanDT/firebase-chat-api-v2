import { Component, OnInit } from '@angular/core';
import { ChatGPTService } from '../chat-gpt.service';
import { getAuth } from '@angular/fire/auth';
import { Mensaje } from 'src/app/model/mensaje';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.css']
})
export class ChatGPTComponent implements OnInit {
  message: string = '';
  messageTemp: string = '';

  currentUser: string = '';

  msg: Mensaje[] = [];
  

  constructor(private chatgptService: ChatGPTService) {}

  async ngOnInit() {
    const user = getAuth().currentUser;
    if (user) {
      this.currentUser = user.uid;
    }
    this.cargarChat()
  }

  async sendMessage() {
    if (this.message.trim() !== '') {
      
      this.chatgptService.getDataFromOpenAI(this.message, this.currentUser);
      this.messageTemp = this.message;
      this.message = ''; 
      await this.cargarChat()
    }
    
  }

  async cargarChat(){
    try {
      this.msg = await this.chatgptService.obtenerMensajesDeChatGpt(this.currentUser);
      
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
    }
    console.log(this.msg)
  }

  clear() {
    this.msg = [];
  }
}
