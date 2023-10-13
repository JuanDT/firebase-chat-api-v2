import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';

export interface SolicitudAmistad {
    remitenteUid: string; // ID del remitente de la solicitud
    estado: 'pendiente' | 'aceptada' | 'rechazada'; // Estado de la solicitud
    fechaEnvio: firebase.firestore.Timestamp; // Fecha y hora de envío de la solicitud
  }