import { FieldValue } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';

export interface Mensaje {
    id: string; 
    remitente: string; 
    contenido: string; 
    fechaEnvio: FieldValue; 
  }