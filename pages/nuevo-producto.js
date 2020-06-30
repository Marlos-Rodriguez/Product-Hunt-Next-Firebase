import React, { useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import FileUploader from "react-firebase-file-uploader";

import { css } from "@emotion/core";

import Layout from "../components/layout/layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/UI/Formulario";

import { FirebaseContext } from "../firebase";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  url: "",
  descripcion: "",
};

const NuevoProducto = () => {
  //state de las imagenes
  const [nombreimagen, guardarNombre] = useState("");
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgreso] = useState(0);
  const [urlimagen, guardarUrlImagen] = useState("");

  const [error, guardarError] = useState(false);

  const {
    valores,
    errores,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearProducto, CrearProducto);

  const { nombre, empresa, url, descripcion } = valores;

  //Hook de routin para redireccionar
  const router = useRouter();

  //Context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function CrearProducto() {
    //Si el usuario no esta autenticado llevar a login
    if (!usuario) {
      return router.push("/login");
    }

    //Crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
    };

    //Insertar en la base de datos
    firebase.db.collection("productos").add(producto);

    return router.push("/");
  }

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
  };

  const handleProgress = (progreso) => guardarProgreso({ progreso });

  const handleUploadError = (error) => {
    guardarSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = (nombre) => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre);
    firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        guardarUrlImagen(url);
      });
  };

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Nuevo Producto
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>Informacion General</legend>
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Tu Nombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}

              <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  placeholder="Nombre Empresa o Compañia"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.empresa && <Error>{errores.empresa}</Error>}

              <Campo>
                <label htmlFor="imagen">Imagen</label>
                <FileUploader
                  accept="image/*"
                  id="imagen"
                  name="imagen"
                  randomizeFilename
                  storageRef={firebase.storage.ref("productos")}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                />
              </Campo>

              <Campo>
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  placeholder="URL del producto"
                  name="url"
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.url && <Error>{errores.url}</Error>}
            </fieldset>
            <fieldset>
              <legend>Sobre tu Producto</legend>
              <Campo>
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  placeholder="Descripcion del producto"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.descripcion && <Error>{errores.descripcion}</Error>}
            </fieldset>
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Crear Producto" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default NuevoProducto;
