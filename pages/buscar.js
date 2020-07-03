import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { css } from "@emotion/core";

import Layout from "../components/layout/layout";
import DetallesProducto from "../components/layout/DetallesProducto";
import useProductos from "../hooks/useProductos";

const Buscar = () => {
  const router = useRouter();
  const {
    query: { q },
  } = router;

  //Todos los productos
  const { productos } = useProductos("creado");
  const [resultado, guardarResultado] = useState([]);

  useEffect(() => {
    const busqueda = q.toLowerCase();

    const filtro = productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda) ||
        producto.empresa.toLowerCase().includes(busqueda) ||
        producto.creador.nombre.toLowerCase().includes(busqueda)
      );
    });

    guardarResultado(filtro);
  }, [q, productos]);

  if (resultado.length === 0) console.log(resultado);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            {resultado.length === 0 ? (
              <h1
                css={css`
                  margin-top: 5rem;
                  text-align: center;
                `}
              >
                Producto no encontrado
              </h1>
            ) : (
              <ul className="bg-white">
                {resultado.map((producto) => (
                  <DetallesProducto key={producto.id} producto={producto} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Buscar;
