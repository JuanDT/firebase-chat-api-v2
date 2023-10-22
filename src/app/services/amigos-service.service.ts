import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc, FieldValue, deleteDoc, collectionData, query, where, getDocs, serverTimestamp } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { Usuario } from '../model/usuario';
import firebase from 'firebase/compat/app';
import { user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { SolicitudAmistad } from '../model/solicitudAmistad';

@Injectable({
  providedIn: 'root'
})
export class AmigosService {

  constructor(private firestore: Firestore) { }

  async sendFriendRequest(senderUid: string, recipientUid: string): Promise<void> {
    const request: SolicitudAmistad = {
      remitenteUid: senderUid,
      estado: 'pendiente', 
      fechaEnvio: serverTimestamp()
    };

    const recipientRef = doc(collection(this.firestore, 'usuario'), recipientUid);
    const friendRequestsRef = collection(recipientRef, 'solicitudesAmistad');
    const requestDocRef = doc(friendRequestsRef, senderUid);
    console.log("Solicitud Enviada")
    await setDoc(requestDocRef, request);
  }
  

  async removeFriend(currentUserUid: string, friendUid: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'usuario', currentUserUid);
      const friendRef = doc(this.firestore, 'usuario', friendUid);
  
      const amigosCollectionRef = collection(userRef, 'amigos');
      const currentUserFriendRef = doc(amigosCollectionRef, friendUid);
      await deleteDoc(currentUserFriendRef);
  
      const friendAmigosCollectionRef = collection(friendRef, 'amigos');
      const friendUserRef = doc(friendAmigosCollectionRef, currentUserUid);
      await deleteDoc(friendUserRef);
  
      console.log('Amigo eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
      throw error;
    }
  }

  getData(): Observable<any[]>{
    const ref = collection(this.firestore, 'usuario');
    return collectionData(ref,{idField: 'uid'}) as Observable<any>
  }


  async getFriends(userId: string): Promise<Usuario[]> {
    try {
      const userRef = doc(this.firestore, 'usuario', userId);
      const amigosCollectionRef = collection(userRef, 'amigos');
      const querySnapshot = await getDocs(amigosCollectionRef);
      const friends: Usuario[] = [];
  
      for (const docSnap of querySnapshot.docs) {
        const friendId = docSnap.id;
        const friendRef = doc(this.firestore, 'usuario', friendId);
        const friendDoc = await getDoc(friendRef);
  
        if (friendDoc.exists()) {
          friends.push(friendDoc.data() as Usuario);
        }
      }
  
      return friends;
    } catch (error) {
      console.error('Error al obtener amigos:', error);
      throw error;
    }
  }

  async getFriendRequests(userId: string): Promise<{ solicitud: SolicitudAmistad, remitente: Usuario }[]> {
    try {
      const userRef = doc(this.firestore, 'usuario', userId);
      const friendRequestsCollectionRef = collection(userRef, 'solicitudesAmistad');
      
      const querySnapshot = await getDocs(friendRequestsCollectionRef);
      const friendRequests: { solicitud: SolicitudAmistad, remitente: Usuario }[] = [];
  
      for (const docSnap of querySnapshot.docs) {
        const friendRequestData = docSnap.data() as SolicitudAmistad;
        const remitenteUid = friendRequestData.remitenteUid;
  
        const remitenteDocRef = doc(this.firestore, 'usuario', remitenteUid);
        const remitenteDocSnap = await getDoc(remitenteDocRef);
  
        if (remitenteDocSnap.exists()) {
          const remitenteData = remitenteDocSnap.data() as Usuario;
          friendRequests.push({ solicitud: friendRequestData, remitente: remitenteData });
        }
      }
  
      return friendRequests;
    } catch (error) {
      console.error('Error al obtener solicitudes de amistad:', error);
      throw error;
    }
  }

  async getFriendRequests2(userId: string): Promise<SolicitudAmistad[]> {
    try {
      const userRef = doc(this.firestore, 'usuario', userId);
      const friendRequestsCollectionRef = collection(userRef, 'solicitudesAmistad');
      
      const querySnapshot = await getDocs(friendRequestsCollectionRef);
      const friendRequests: SolicitudAmistad[] = [];
  
      for (const docSnap of querySnapshot.docs) {
        const friendRequestData = docSnap.data() as SolicitudAmistad;
        friendRequests.push(friendRequestData);
      }
      console.log("SOlicutudes obtenidas")
      return friendRequests;
    } catch (error) {
      console.error('Error al obtener solicitudes de amistad:', error);
      throw error;
    }
  }

  async hasPendingFriendRequest(currentUserUid: string, friendUid: string): Promise<boolean> {
    try {
      const friendUserRef = doc(this.firestore, 'usuario', friendUid);
  
      const friendRequestsCollectionRef = collection(friendUserRef, 'solicitudesAmistad');
  
      const querySnapshot = await getDocs(friendRequestsCollectionRef);
  
      for (const docSnap of querySnapshot.docs) {
        const friendRequestData = docSnap.data() as SolicitudAmistad;
  
        if (friendRequestData.estado === 'pendiente' && friendRequestData.remitenteUid === currentUserUid) {
          return true;
        }
      }
  
      return false; 
    } catch (error) {
      console.error('Error al verificar las solicitudes de amistad del amigo:', error);
      throw error;
    }
  }


  async acceptFriendRequest(userId: string, friendRequestId: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'usuario', userId);
      const friendRequestRef = doc(this.firestore, 'usuario', userId, 'solicitudesAmistad', friendRequestId);
  
      const friendRequestDoc = await getDoc(friendRequestRef);
  
      if (friendRequestDoc.exists()) {
        const friendRequestData = friendRequestDoc.data() as SolicitudAmistad;
  
        if (friendRequestData.estado === 'pendiente') {
          await updateDoc(friendRequestRef, { estado: 'aceptada' });
  
          const friendUid = friendRequestData.remitenteUid;
          const friendUserRef = doc(this.firestore, 'usuario', friendUid);
  
          const amigosCollectionRef = collection(userRef, 'amigos');
          await setDoc(doc(amigosCollectionRef, friendUid), {});
  
          const friendAmigosCollectionRef = collection(friendUserRef, 'amigos');
          await setDoc(doc(friendAmigosCollectionRef, userId), {});
  
          await deleteDoc(friendRequestRef);
  
          console.log('Solicitud de amistad aceptada');
        } else {
          console.log('La solicitud de amistad ya ha sido aceptada o rechazada previamente.');
        }
      } else {
        console.log('La solicitud de amistad no existe.');
      }
    } catch (error) {
      console.error('Error al aceptar la solicitud de amistad:', error);
      throw error;
    }
  }
  
 
  async searchFriendsByNickname(userId: string, searchTerm: string): Promise<Usuario[]> {
    try {
      const userRef = doc(collection(this.firestore, 'usuarios'), userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData && userData['amigos']) {
          const friendIds: string[] = userData['amigos'];

          const friendsPromises = friendIds.map(async (friendId) => {
            const friendRef = doc(collection(this.firestore, 'usuarios'), friendId);
            const friendDoc = await getDoc(friendRef);

            if (friendDoc.exists()) {
              const friendData = friendDoc.data() as Usuario;
              if (friendData.displayName.includes(searchTerm)) {
                return friendData;
              }
            }

            return null;
          });

          const friendsData = await Promise.all(friendsPromises);
          return friendsData.filter((friend) => friend !== null) as Usuario[];
        }
      }

      return [];
    } catch (error) {
      console.error('Error al buscar amigos por nickname:', error);
      throw error;
    }
  }

  async searchFriends(userId: string, searchTerm: string): Promise<Usuario[]> {
    try {
      const userRef = doc(this.firestore, 'usuario', userId);
      const amigosCollectionRef = collection(userRef, 'amigos');
      const querySnapshot = await getDocs(amigosCollectionRef);
      const friends: Usuario[] = [];
  
      for (const docSnap of querySnapshot.docs) {
        const friendId = docSnap.id;
        const friendRef = doc(this.firestore, 'usuario', friendId);
        const friendDoc = await getDoc(friendRef);
  
        if (friendDoc.exists()) {
          const friendData = friendDoc.data() as Usuario;
  
          if (friendData.displayName.includes(searchTerm) || friendData.email.includes(searchTerm)) {
            friends.push(friendData);
          }
        }
      }
  
      return friends;
    } catch (error) {
      console.error('Error al buscar amigos por nickname o email:', error);
      throw error;
    }
  }
  
  


  async searchUsers(searchTerm: string, currentUserId: string): Promise<Usuario[]> {
    const usersCollection = collection(this.firestore, 'usuario');
    const userQuery = query(usersCollection, where('displayName', '>=', searchTerm), where('displayName', '<=', searchTerm + '\uf8ff'));
  
    const querySnapshot = await getDocs(userQuery);
    const results: Usuario[] = [];
  
    querySnapshot.forEach((doc) => {
      const user = doc.data() as Usuario;
      if (user.uid !== currentUserId && (user.displayName.includes(searchTerm) || user.email.includes(searchTerm))) {
        results.push(user);
      }
    });
  
    return results;
  }
  
  
  
}
