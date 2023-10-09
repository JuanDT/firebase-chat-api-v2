import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterModule } from '../footer/footer.module';


@NgModule({
  declarations: [LoginComponent, 
    RegisterComponent],
  imports: [
    
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FooterModule
  ], exports:[LoginComponent, 
    RegisterComponent]
})
export class AuthModule { }
