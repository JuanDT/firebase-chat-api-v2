import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavRoutingModule } from './nav-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { PerfilModule } from '../perfil/perfil.module';


@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    NavRoutingModule
    
  ], exports:[NavbarComponent]
})
export class NavModule { }
