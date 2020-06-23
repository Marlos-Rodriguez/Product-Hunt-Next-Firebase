import React, { useEffect, useState } from "react";
import firebase from "../firebase";

function useAutenticacion(params) {
  const [usuarioAutenticado, guardarusuarioAutenticado] = useState(null);

  useEffect(() => {
    const unsuscribe = firebase.auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        guardarusuarioAutenticado(usuario);
      } else {
        guardarusuarioAutenticado(null);
      }
    });
    return () => unsuscribe();
  }, []);

  return usuarioAutenticado;
}

export default useAutenticacion;
