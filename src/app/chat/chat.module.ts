import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmigosModule } from '../amigos/amigos.module';
import { ChatGPTComponent } from './chat-gpt/chat-gpt.component';


@NgModule({
  declarations: [
    ChatComponent,
    ChatGPTComponent
    
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AmigosModule
  ],exports:[ChatComponent, ChatGPTComponent]
})
export class ChatModule { }
