import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';

export interface Mensaje {
    id: string; // ID único del mensaje
    remitente: string; // ID del remitente del mensaje
    contenido: string; // Contenido del mensaje
    fechaEnvio: firebase.firestore.Timestamp; // Fecha y hora de envío del mensaje
  }