import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";

import { css } from "@emotion/core";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";

import Layout from "../../components/layout/layout";
import { Campo, InputSubmit } from "../../components/UI/Formulario";
import Boton from "../../components/UI/Boton";

import { FirebaseContext } from "../../firebase";

import Error404 from "../../components/layout/404";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  //state del componente
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardarConsultarDB] = useState(true);

  //Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          guardarProducto(producto.data());
          guardarConsultarDB(false);
        } else {
          guardarError(true);
          guardarConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando...";

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    Votado,
  } = producto;

  //Administrar y validar votos
  const votarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    //Obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //Verificar si el usuario actual ha votado
    if (Votado.includes(usuario.uid)) return;

    //Guardar el ID del usuario que ha votado
    const haVotado = [...Votado, usuario.uid];

    //Actualizar en la DB
    await firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, Votado: haVotado });

    //Actualizar el State
    guardarProducto({
      ...producto,
      votos: nuevoTotal,
    });

    guardarConsultarDB(true); //Hay un voto, consultar DB
  };

  //Funciones para crear comentarios
  const comentarioChange = (e) => {
    guardarComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  //Identifica si el comentario es del creador del Producto
  const esCreador = (id) => {
    if (creador.id == id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }

    //Informacion extra al comentraio
    comentario.usuarioID = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //Tomar copia de comentario y agregarlos al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //Actualizar la DB
    firebase.db.collection("productos").doc(id).update({
      comentarios: nuevosComentarios,
    });

    //Actualizar el State
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });

    guardarConsultarDB(true); //Hay un comentario, Consultar DB
  };

  //Funcion que revisa que el creador del producto sea el mismo que esta autenticado
  const puedeBorrar = () => {
    if (!usuario) return false;

    if (creador.id === usuario.uid) return true;
  };

  //elimina el Producto de la base de datos
  const eliminarProducto = async () => {
    if (!usuario) return router.push("/login");

    if (creador.id !== usuario.uid) return router.push("/");
    try {
      firebase.db.collection("productos").doc(id).delete();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                <img src={urlimagen} />
                <p
                  css={css`
                    margin-bottom: 0;
                  `}
                >
                  Publicado Por: {creador.nombre} de {empresa}
                </p>
                <p
                  css={css`
                    margin-top: 0;
                  `}
                >
                  Hace {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>{descripcion}</p>
                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={comentarioChange}
                        />
                      </Campo>
                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}
                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "Aun no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioID}-${i}}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:{" "}
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {comentario.usuarioNombre}
                          </span>{" "}
                        </p>
                        {esCreador(comentario.usuarioID) && (
                          <CreadorProducto>Es Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Boton target="_blank" bgColor="true" href={url}>
                  Visitar URL
                </Boton>

                <div
                  css={css`
                    margin-top: 7rem;
                  `}
                >
                  {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votos} Votos
                  </p>
                </div>
              </aside>
            </ContenedorProducto>
            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
