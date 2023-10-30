import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from '../chat/chat/chat.component';
import { ChatGPTComponent } from '../chat/chat-gpt/chat-gpt.component';

const routes: Routes = [
  { path: 'dashboard', component: ChatComponent },
  { path: 'chatGPT', component: ChatGPTComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
