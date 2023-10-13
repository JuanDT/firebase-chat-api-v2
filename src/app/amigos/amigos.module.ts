import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmigosRoutingModule } from './amigos-routing.module';
import { MisAmigosComponent } from './mis-amigos/mis-amigos.component';
import { ListaAmigosComponent } from './lista-amigos/lista-amigos.component';
import { AgregarAmigoComponent } from './agregar-amigo/agregar-amigo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MisAmigosComponent,
    ListaAmigosComponent,
    AgregarAmigoComponent
  ],
  imports: [
    CommonModule,
    AmigosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ], exports: [
    MisAmigosComponent,
    ListaAmigosComponent,
    AgregarAmigoComponent]
})
export class AmigosModule { }
