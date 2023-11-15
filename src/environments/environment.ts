
import { initializeApp } from "@angular/fire/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const environment = {
  firebase: {
    apiKey: "AIzaSyBG4OoCGcyZj04vSKxiSAEItYEeOInZIgo",
    authDomain: "chatangular-d2ed4.firebaseapp.com",
    projectId: "chatangular-d2ed4",
    storageBucket: "chatangular-d2ed4.appspot.com",
    messagingSenderId: "339929742439",
    appId: "1:339929742439:web:e7f1d4e637890534a0e8c2"
  },
  production: false
};

export const enviromentAI ={
  production: false,
  apiKey: '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'
}


