import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, fetchSignInMethodsForEmail, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL  } from 'firebase/storage';
import { Router } from '@angular/router';
import { Firestore, collection, setDoc, doc, addDoc } from '@angular/fire/firestore';
import {  getFirestore, updateDoc } from 'firebase/firestore';
import { Usuario } from '../model/usuario';
 



@Injectable({
  providedIn: 'root'
})
export class UserService {
  getAuthenticatedUser() {
    throw new Error('Method not implemented.');
  }
 
  private userTokens: Map<string, string> = new Map();

  private email: string | null = null;
 

  constructor(private auth: Auth, private firestore: Firestore) { }

  getEmail(): string | null {
    return this.email;
  }

  saveUser(user: Usuario){
     const userRef = collection(this.firestore, 'usuario');
     console.log(this.firestore)
     const docRef = doc(userRef, user.uid);
     console.log("creada"+docRef, user.uid, user.displayName, user.displayName)
    const docu = setDoc(docRef, user);
    console.log("documento: "+docu)
  }

  async actualizarNickname(nuevoNickname: string): Promise<void> {
    try {

      const userId = this.auth.currentUser?.uid;

      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      const db = getFirestore();
      const userRef = doc(db, 'usuarios', userId);

      await updateDoc(userRef, { nickname: nuevoNickname });

    } catch (error) {
      throw error;
    }
  }
 

  register({ email, password }: any) {
 
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({ email, password }: any): Promise<any> {
    this.printUserTokens();
    if (this.emailExists(email) == true ) {
      return Promise.reject('Ya existe una sesión activa con este correo electrónico.');
    }else{
      return signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      const userToken = this.generateUniqueToken();
      this.userTokens.set(email, userToken);
      console.log("size: "+this.userTokens.size)
      this.email = email;
      console.log(userToken)
      

      return userCredential;
    });
    }
  
  }

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }



  async login2({ email, password }: any): Promise<any> {
    console.log(email)

    const existingToken = this.userTokens.get(email);
    console.log(existingToken+" , "+email)
    if (existingToken) {
      return Promise.reject('Ya existe una sesión activa con este correo electrónico.');
    }else{
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
  
        const userToken = this.generateUniqueToken();
        this.userTokens.set(userToken, email);
        this.email = email;
        console.log(userToken)

        return userCredential;        
  
      } catch (error) {
      }
    }

    
  }

  
  printUserTokens() {
    console.log('Contenido de userTokens:');
    this.userTokens.forEach((token, email) => {
      console.log(`Correo: ${email}, Token: ${token}`);
    });
  }

  
  private generateUniqueToken(): string {
    return uuidv4();
  }

  getUserToken(email: string): string | undefined {
    for (const [token, userEmail] of this.userTokens) {
      if (userEmail.match(email) ) {
        return token;
      }
    }
    console.log('puede iniciar')
    return undefined;
  }

  emailExists(email: string): boolean {
    console.log(this.userTokens.size);
      if(this.userTokens.has(email)){
        console.log(this.userTokens.get(email))
        return true;

      }else{
        return false;
      }
      
  }

  getUserLogged():any{
    return this.auth.currentUser
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }


  async logout(): Promise<void> {
    const currentUser = this.auth.currentUser;
    console.log("current: "+currentUser?.email)
    if (currentUser) {
        
      let email = currentUser.email;
      console.log("current: "+currentUser?.email)
      console.log("email: "+email)
      if(email){
        let token = this.userTokens.get(email);
        console.log("token: "+token)
          if(token){
            
            console.log("token eliminado: "+token)

            this.userTokens.forEach((valor, clave) => {
              console.log(`Clave: ${clave}, Valor: ${valor}`);
            });

            this.userTokens.delete(email);

            this.userTokens.forEach((valor, clave) => {
              console.log(`Clave: ${clave}, Valor: ${valor}`);
            });
            console.log("size: "+this.userTokens.size)
          }
           
      }
       
    }

    // Cerrar sesión con Firebase
    await signOut(this.auth);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
        fetchSignInMethodsForEmail(this.auth, email)
        .then((methods) => {        
          const exists = methods && methods.length > 0;
          observer.next(exists);
        })
        .catch((error) => {
          console.error('Error al verificar el correo:', error);
          observer.error(error);
        });
    });
  }

  checkPasswordLength(password: string): boolean {
     return password.length >= 6;
  }

}
