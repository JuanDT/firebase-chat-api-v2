import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Chat } from '../model/chat';
import { v4 as uuidv4 } from 'uuid';

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
}
