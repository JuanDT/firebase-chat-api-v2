import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatGPTComponent } from './chat-gpt/chat-gpt.component';

const routes: Routes = [
  { path: '', component: ChatComponent },
  { path: 'chatGPT', component: ChatGPTComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
