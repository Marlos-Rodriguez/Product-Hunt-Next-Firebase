import app from "firebase/app";
import analytics from "firebase/analytics";
import "firebase/auth";

import firebaseConfig from "./config";

class Firebase {
  constructor() {
    // Initialize Firebase
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
      app.analytics();
    }
    this.auth = app.auth();
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
}

const firebase = new Firebase();
export default firebase;
