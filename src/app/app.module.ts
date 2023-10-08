import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main/main/main.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth, AuthModule } from '@angular/fire/auth';
import { FooterComponent } from './footer/footer/footer.component';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { StartComponent } from './components/start/start.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { DashboardModule } from './dashboard/dashboard.module';
import { FooterModule } from './footer/footer.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,     
    SobreNosotrosComponent,
    StartComponent,
    PageNotFoundComponent
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    DashboardModule,
    FooterModule,
    AuthModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
