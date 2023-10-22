import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';
import { NavModule } from '../nav/nav.module';
import { ChatModule } from '../chat/chat.module';
import { FooterModule } from '../footer/footer.module';
import { AmigosModule } from '../amigos/amigos.module';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    NavModule,
    ChatModule,
    FooterModule,
    AmigosModule
  ], exports:[MainComponent]
})
export class MainModule { }
