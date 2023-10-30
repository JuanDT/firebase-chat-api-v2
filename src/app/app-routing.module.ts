import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './main/main/main.component';
import { RegisterComponent } from './auth/register/register.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { StartComponent } from './components/start/start.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { MiPerfilComponent } from './perfil/mi-perfil/mi-perfil.component';
import { ChatComponent } from './chat/chat/chat.component';
import { ChatGPTComponent } from './chat/chat-gpt/chat-gpt.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/auth/login']))
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/auth/login'])),
    children: [
      {
        path: 'main',
        component: MainComponent,
        children: [
          { path: '', component: ChatComponent },
          { path: 'ia-chatmart', component: ChatGPTComponent },
        ]
      }
    ]
  },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'sobreNosotros', component: SobreNosotrosComponent},
  {path:'perfil', component: MiPerfilComponent},
  { path: 'start', component: StartComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
