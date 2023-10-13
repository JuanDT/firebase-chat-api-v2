import { Mensaje } from "./mensaje";

export interface Chat {
    id: string; // ID único del chat
    participantes: string[]; // IDs de los participantes del chat
    mensajes: Mensaje[]; // Lista de mensajes en el chat
  }