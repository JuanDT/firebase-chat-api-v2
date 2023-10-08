// amigos.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AmigosService {
  constructor(private firestore: AngularFirestore) {}

  // Método para obtener la lista de amigos del usuario actual
  getListaAmigos(usuarioId: string) {
    return this.firestore
      .collection('amigos')
      .doc(usuarioId)
      .collection('lista')
      .valueChanges();
  }

  // Método para enviar una solicitud de amistad
  enviarSolicitudAmistad(usuarioId: string, amigoId: string) {
    // Implementa la lógica para enviar una solicitud de amistad a amigoId
  }

  // Método para aceptar una solicitud de amistad
  aceptarSolicitudAmistad(usuarioId: string, solicitudId: string) {
    // Implementa la lógica para aceptar la solicitud de amistad
  }

  // Otros métodos para gestionar amigos y solicitudes de amistad
}
