export class Usuario {
    displayName: string;
    email: string;
    photoURL: string;
    emailVerified: boolean;
  
    constructor(displayName: string, email: string, photoURL: string, emailVerified: boolean) {
      this.displayName = displayName;
      this.email = email;
      this.photoURL = photoURL;
      this.emailVerified = emailVerified;
    }
  }
  