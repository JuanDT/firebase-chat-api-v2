// amigos.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AmigosService {
  constructor(private firestore: AngularFirestore) {}

  getListaAmigos(usuarioId: string) {
    return this.firestore
      .collection('amigos')
      .doc(usuarioId)
      .collection('lista')
      .valueChanges();
  }

  enviarSolicitudAmistad(usuarioId: string, amigoId: string) {
    console.log("hola")
  }

  aceptarSolicitudAmistad(usuarioId: string, solicitudId: string) {
  }

}
