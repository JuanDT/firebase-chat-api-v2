import { Usuario } from './usuario';

export class Admin extends Usuario {
  isAdmin: boolean;

  constructor(displayName: string, email: string, photoURL: string, emailVerified: boolean, isAdmin: boolean) {
    super(displayName, email, photoURL, emailVerified);
    this.isAdmin = isAdmin;
  }
}
