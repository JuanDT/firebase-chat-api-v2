import { Injectable } from '@angular/core';
import { FieldValue, Firestore, QuerySnapshot, addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from '@angular/fire/firestore';
import { Chat } from '../model/chat';
import { v4 as uuidv4 } from 'uuid';
import { Mensaje } from '../model/mensaje';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  constructor(private firestore: Firestore) { }

  createChat(participantes: string[]): void {
    const chatId = uuidv4();
    
    const newChat: Chat = {
      id: chatId,
      participantes: participantes,
      mensajes: [] 
    };

    const chatCollection = collection(this.firestore, 'chats');
    const chatDoc = doc(chatCollection, chatId);

    setDoc(chatDoc, newChat)
      .then(() => {
        console.log('Conversación creada con éxito.');
      })
      .catch((error) => {
        console.error('Error al crear la conversación:', error);
      });
  }

  async enviarMensaje(chatId: string, remitente: string, contenido: string): Promise<void> {
    try {
     
      const mensaje: Mensaje = {
        id: '', 
        remitente: remitente,
        contenido: contenido,
        fechaEnvio: serverTimestamp()
      };

      const mensajeCollection = collection(this.firestore, 'chats', chatId, 'mensajes');
      const nuevoMensajeRef = await addDoc(mensajeCollection, mensaje);

      mensaje.id = nuevoMensajeRef.id;

      const mensajeDoc = doc(mensajeCollection, nuevoMensajeRef.id);
      await setDoc(mensajeDoc, mensaje);
      console.log("El mensaje se envió")


    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }

  async actualizarUltimoMensaje(chatId: string, ultimoMensaje: Mensaje): Promise<void> {
    try {
      const chatRef = doc(this.firestore, 'chats', chatId);
      await setDoc(chatRef, { ultimoMensaje: ultimoMensaje });

    } catch (error) {
      console.error('Error al actualizar el último mensaje del chat:', error);
      throw error;
    }
  }

  async cargarMensajes(currentUserUid: string, amigoUid: string): Promise<Chat[]> {
    const chatsCollection = collection(this.firestore, 'chats');
    const chatsQuery = query(chatsCollection);
  
    try {
      const querySnapshot: QuerySnapshot = await getDocs(chatsQuery);
      const chats: Chat[] = [];
  
      for (const doc of querySnapshot.docs) {
        const chatData = doc.data() as Chat;
        const chatParticipantes = chatData.participantes;
  
        if (chatParticipantes && chatParticipantes.includes(currentUserUid) && chatParticipantes.includes(amigoUid)) {
          const chatId = doc.id;
          const mensajesCollection = collection(this.firestore, 'chats', chatId, 'mensajes');
          const mensajesQuery = query(mensajesCollection);
          const mensajesSnapshot = await getDocs(mensajesQuery);
          const mensajes: Mensaje[] = [];
  
          mensajesSnapshot.forEach((mensajeDoc) => {
            mensajes.push(mensajeDoc.data() as Mensaje);
          });
  
          // Agregar los mensajes al chat
          chatData.mensajes = mensajes;
  
          chats.push(chatData);
        }
      }
  
      return chats;
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      throw error;
    }
  }
  
  async obtenerMensajesDelChat(chatId: string): Promise<Mensaje[]> {
    const mensajesCollection = collection(this.firestore, 'chats', chatId, 'mensajes');
    const mensajesQuery = query(mensajesCollection);

    const mensajes: Mensaje[] = [];

    try {
        const querySnapshot: QuerySnapshot = await getDocs(mensajesQuery);

        querySnapshot.forEach((doc) => {
            const mensajeData = doc.data() as Mensaje;
            mensajes.push(mensajeData);
        });
        console.log("se obtuvieron los mensajes del chat")
        return mensajes;
    } catch (error) {
        console.error('Error al obtener mensajes del chat:', error);
        throw error;
    }
  
  
  }
  
}
