import { Component, OnInit } from '@angular/core';

import { ChatGPTService } from '../chat-gpt.service';
import { Configuration, OpenAIApi } from "openai";

import { enviromentAI } from 'src/environments/environment';



@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.css']
})
export class ChatGPTComponent implements OnInit {

  message!: string;

  constructor( private chatgptService: ChatGPTService ){ }

 
  ngOnInit(): void {
  
  }

  sendMessage(){
    this.chatgptService.getDataFromOpenAI(this.message);
    this.message = '';
  }

  clear(){
    location.reload()
  }
  
}
