import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviromentAI, environment } from 'src/environments/environment'; 
import { from, filter, map } from 'rxjs';
import { Configuration, OpenAIApi } from "openai";
import { data } from 'jquery';
import * as $ from 'jquery';
import { Firestore, addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { Mensaje } from '../model/mensaje';
import { v4 as uuidv4 } from 'uuid';
import { user } from '@angular/fire/auth';
import { ChatGpt } from '../model/chatGpt';


const APIKEY = enviromentAI.apiKey;


@Injectable({
  providedIn: 'root',
})
export class ChatGPTService {
  

  constructor(private firestore: Firestore) { }

  readonly configurarion = new Configuration({
    apiKey: APIKEY
  });

  readonly openai = new OpenAIApi(this.configurarion);

  async guardarChatGpt(userId: string, respuestaGpt: string, texto: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'usuario', userId);
      const chatGptCollectionRef = collection(userRef, 'chatGpt');
  
      const chatGptQuery = query(chatGptCollectionRef);
      const chatGptQuerySnapshot = await getDocs(chatGptQuery);
  
      let chatGptId: string;
  
      if (chatGptQuerySnapshot.empty) {
        const newChatGptDoc = await addDoc(chatGptCollectionRef, {});
        chatGptId = newChatGptDoc.id;
      } else {
        chatGptId = chatGptQuerySnapshot.docs[0].id;
      }
  
      const mensajesCollectionRef = collection(doc(chatGptCollectionRef, chatGptId), 'mensajes');
  
      const mensaje: Mensaje = {
        id: Date.now(), 
        remitente: userId,
        contenido: texto,
        fechaEnvio: serverTimestamp(),
      };
  
      const mensajeGpt: Mensaje = {
        id: Date.now() + 1,
        remitente: 'openAi',
        contenido: respuestaGpt,
        fechaEnvio: serverTimestamp(),
      };
  
      await addDoc(mensajesCollectionRef, mensaje);
      await addDoc(mensajesCollectionRef, mensajeGpt);
  
      console.log('Mensaje y respuesta del chat agregados a chatGpt correctamente');
    } catch (error) {
      console.error('Error al guardar el chatGpt, el mensaje y la respuesta del chat:', error);
      throw error;
    }
  }
  
  
  async obtenerMensajesDeChatGpt(userId: string): Promise<Mensaje[]> {
    try {
      const userRef = doc(this.firestore, 'usuario', userId);
      const chatGptCollectionRef = collection(userRef, 'chatGpt');
  
      const chatGptQuery = query(chatGptCollectionRef);
      const chatGptQuerySnapshot = await getDocs(chatGptQuery);
  
      if (!chatGptQuerySnapshot.empty) {
        const chatGptId = chatGptQuerySnapshot.docs[0].id;
  
        const mensajesCollectionRef = collection(doc(chatGptCollectionRef, chatGptId), 'mensajes');
        const mensajesQuery = query(mensajesCollectionRef, orderBy('fechaEnvio'));
  
        const mensajesQuerySnapshot = await getDocs(mensajesQuery);
  
        const mensajes: Mensaje[] = [];
  
        mensajesQuerySnapshot.forEach((doc) => {
          const mensaje = doc.data() as Mensaje;
          mensajes.push(mensaje);
        });
  
        return mensajes;
      }
  
      return [];
    } catch (error) {
      console.error('Error al obtener los mensajes del chatGpt:', error);
      throw error;
    }
  }
  
  
  

  


  getDataFromOpenAI(text: string, userId: string){
       $('.respuesta-temp').hide
       from(this.openai.createCompletion({
          model: 'text-davinci-003',
          prompt: text,
          max_tokens: 256,
          temperature:  0.7
        })).pipe(

            filter(resp=>!!resp && !!resp.data),
            map(resp=>resp.data),
            filter((data:any)=>(

            data.choices && data.choices.length > 0 && data.choices[0].text        
          )),
          map(data=>data.choices[0].text)

         ).subscribe(async data=>{
          console.log(data);
           await this.guardarChatGpt(userId, data ,text)
           $('.respuesta-temp').append(`
           <ul class="list-group mb-2">
           <li class="list-group-item text-light" style="background-color:rgb(127, 130, 130);">${data}</li><br>
           </ul>
           `)
 
         })
        
        
  }
}
