import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import firebaseConfig from "./config";

class Firebase {
  constructor() {
    // Initialize Firebase
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
    }
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
  }

  //Registra un Usuario
  async registrar(nombre, email, password) {
    const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    return await nuevoUsuario.user.updateProfile({
      displayName: nombre,
    });
  }

  //Inicia Sesion del usuario
  async login(email, password) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  //Cierra la sesión del usuario
  async cerrarSesion() {
    await this.auth.signOut();
  }
}

const firebase = new Firebase();
export default firebase;
