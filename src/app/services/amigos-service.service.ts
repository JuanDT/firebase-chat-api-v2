import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc, FieldValue, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Usuario } from '../model/usuario';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AmigosService {

  constructor(private firestore: Firestore) { }

  async sendFriendRequest(senderUid: string, recipientUid: string): Promise<void> {
    const request = {
      remitenteUid: senderUid,
      estado: 'pendiente',
      fechaEnvio: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const recipientRef = doc(collection(this.firestore, 'usuarios'), recipientUid);
    const friendRequestsRef = collection(recipientRef, 'solicitudesAmistad');
    const requestDocRef = doc(friendRequestsRef, senderUid);

    await setDoc(requestDocRef, request);
  }
  
  async acceptFriendRequest(userId: string, friendId: string): Promise<void> {

    // Actualiza el estado de la solicitud de amistad a "aceptada"
    const userFriendRequestRef = doc(collection(this.firestore, 'usuarios', userId, 'solicitudesAmistad'), friendId);
    await updateDoc(userFriendRequestRef, { estado: 'aceptada' });

    //usuario actual
    const userRef = doc(collection(this.firestore, 'usuarios'), userId);
    const userData = (await getDoc(userRef)).data();
    if (userData && userData['amigos'] && !userData['amigos'].includes(friendId)) {
      userData['amigos'].push(friendId);
      await setDoc(userRef, { amigos: userData['amigos'] }, { merge: true });
    }

    //usuario envió
    const friendRef = doc(collection(this.firestore, 'usuarios'), friendId);
    const friendData = (await getDoc(friendRef)).data();
    if (friendData && friendData['amigos'] && !friendData['amigos'].includes(userId)) {
      friendData['amigos'].push(userId);
      await setDoc(friendRef, { amigos: friendData['amigos'] }, { merge: true });
      await deleteDoc(userFriendRequestRef);
    }
    
  }
  

  async removeFriend(currentUser: User, friendId: string): Promise<void> {
    try {
      const userRef = doc(collection(this.firestore, 'usuarios'), currentUser.uid);
      const friendRef = doc(collection(this.firestore, 'usuarios'), friendId);

      await setDoc(userRef, { amigos: arrayRemove(friendId) }, { merge: true });

      await setDoc(friendRef, { amigos: arrayRemove(currentUser.uid) }, { merge: true });
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
      throw error;
    }
  }

  async getFriends(userId: string): Promise<Usuario[]> {
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
              return friendDoc.data() as Usuario;
            } else {
              return null; 
            }
          });

          const friendsData = await Promise.all(friendsPromises);
          return friendsData.filter((friend) => friend !== null) as Usuario[];
        }
      }

      return [];
    } catch (error) {
      console.error('Error al obtener amigos:', error);
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
}
