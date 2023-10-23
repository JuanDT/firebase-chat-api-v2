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
      console.log("aaaaaaaaaaaaaaaaaa")


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

  async cargarMensajes(currentUserUid: string, amigoUid: string): Promise<{ chatId: string, mensajes: Mensaje[] }[]> {
    const chatsCollection = collection(this.firestore, 'chats');
    const chatsQuery = query(chatsCollection);
  
    try {
      const querySnapshot: QuerySnapshot = await getDocs(chatsQuery);
      const chatsMensajes: { chatId: string, mensajes: Mensaje[] }[] = [];
  
      querySnapshot.forEach((doc) => {
        const chatData = doc.data() as Chat;
        const chatParticipantes = chatData.participantes;
  
        if (chatParticipantes && chatParticipantes.includes(currentUserUid) && chatParticipantes.includes(amigoUid)) {
          const mensajesChat = chatData.mensajes || [];
          const chatId = doc.id;
          chatsMensajes.push({ chatId, mensajes: mensajesChat });
        }
      });
  
      return chatsMensajes;
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      throw error;
    }
  }
  
  
  
}
