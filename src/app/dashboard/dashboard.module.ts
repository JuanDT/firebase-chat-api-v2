import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from '../main/main/main.component';
import { MainModule } from '../main/main.module';
import { NavModule } from '../nav/nav.module';
import { FooterModule } from '../footer/footer.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MainModule,
    NavModule,
     FooterModule
  
  ], exports:[DashboardComponent]
})
export class DashboardModule { }
