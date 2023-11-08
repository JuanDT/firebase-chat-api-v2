import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatGPTService } from '../chat-gpt.service';
import { getAuth } from '@angular/fire/auth';
import { Mensaje } from 'src/app/model/mensaje';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClearConfirmationModalComponent } from 'src/app/components/clear-confirmation-modal/clear-confirmation-modal.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.css']
})
export class ChatGPTComponent implements OnInit, AfterViewChecked {
  message: string = '';
  messageTemp: string = '';

  currentUser: string = '';

  isSendingMessage: boolean = false;

  msg: Mensaje[] = [];
  
  @ViewChild('scrollableList', { read: ElementRef }) scrollableList!: ElementRef;

  constructor(private chatgptService: ChatGPTService, private modalService: NgbModal) {}

  async ngOnInit() {
    const user = getAuth().currentUser;
    if (user) {
      this.currentUser = user.uid;
    }
    await this.cargarChat();
  }

  async sendMessage() {
    if (this.message.trim() !== '') {    
        this.isSendingMessage = true;     
      this.chatgptService.getDataFromOpenAI(this.message, this.currentUser);
      this.messageTemp = this.message;
      this.message = ''; 
      await this.cargarChat();

      setTimeout(()=>{
        this.isSendingMessage = false;
      },2200)
    }
  }

  async cargarChat(){
    try {
      this.msg = await this.chatgptService.obtenerMensajesDeChatGpt(this.currentUser);
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollableList.nativeElement.scrollTop = this.scrollableList.nativeElement.scrollHeight;
    } catch (err) {}
  }

  clear() {
    const modalRef = this.modalService.open(ClearConfirmationModalComponent);

    modalRef.result.then((result) => {
      if (result === 'Eliminar') {
        this.chatgptService.eliminarChatGpt(this.currentUser)
        this.msg = [];
        this.cargarChat()
      }
    }).catch((error) => {
      console.log(`Modal cerrado con resultado: ${error}`);
    });
      
    
    
  }
}
