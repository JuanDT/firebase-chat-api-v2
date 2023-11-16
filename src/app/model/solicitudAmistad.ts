import { FieldValue } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';

export interface SolicitudAmistad {
    remitenteUid: string; 
    estado: 'pendiente' | 'aceptada' | 'rechazada'; 
    fechaEnvio: FieldValue; 
  }