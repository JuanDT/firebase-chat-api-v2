import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { UserService } from 'src/app/services/user.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userLogged: any;
  nuevoMensaje: string = '';
  mensajes: any = [
    {
      emisor: "id",
      texto: "hola qué tal",  
    }
  ];

  constructor(private authService: UserService, private auth: Auth) { 
  }

  ngOnInit(): void {
    this.userLogged = this.authService.getUserLogged()
  }

enviarMensaje(){
  console.log(this.nuevoMensaje)
}

}
