import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from '../nav/nav.module';
import { AmigosModule } from '../amigos/amigos.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    MiPerfilComponent
  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NavModule,
    AmigosModule,
    HttpClientModule
 
  ], exports:[MiPerfilComponent]
})
export class PerfilModule { }
