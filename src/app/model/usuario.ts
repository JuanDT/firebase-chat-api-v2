import { SolicitudAmistad } from "./solicitudAmistad";

export interface Usuario {
  uid: string;
  displayName: string;
  email: string;
  solicitudesAmistad: SolicitudAmistad[],
  amigos: [],
  chats: []
}
  