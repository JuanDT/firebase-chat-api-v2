import { Mensaje } from "./mensaje";

export interface Chat {
    id: string; 
    participantes: string[]; 
    mensajes: Mensaje[];
  }