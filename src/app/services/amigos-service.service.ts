import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc, FieldValue, deleteDoc, collectionData, query, where, getDocs } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { Usuario } from '../model/usuario';
import firebase from 'firebase/compat/app';
import { user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

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

  getData(): Observable<any[]>{
    const ref = collection(this.firestore, 'usuario');
    return collectionData(ref,{idField: 'uid'}) as Observable<any>
  }


  async getFriends(userId: string): Promise<Usuario[]> {
    try {
      const userRef = doc(collection(this.firestore, 'usuario'), userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData && userData['amigos']) {
          const friendIds: string[] = userData['amigos'];

          const friendsPromises = friendIds.map(async (friendId) => {
            const friendRef = doc(collection(this.firestore, 'usuario'), friendId);
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
      }else {
        console.log('El documento del usuario no existe.');
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

  async searchFriends(userId: string, searchTerm: string): Promise<Usuario[]> {
    try {
      const userRef = doc(collection(this.firestore, 'usuario'), userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData && userData['amigos']) {
          const friendIds: string[] = userData['amigos'];
  
          const friendsPromises = friendIds.map(async (friendId) => {
            const friendRef = doc(collection(this.firestore, 'usuario'), friendId);
            const friendDoc = await getDoc(friendRef);
  
            if (friendDoc.exists()) {
              const friendData = friendDoc.data() as Usuario;
  
              if (friendData.uid !== userId && (friendData.displayName.includes(searchTerm) || friendData.email.includes(searchTerm))) {
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
