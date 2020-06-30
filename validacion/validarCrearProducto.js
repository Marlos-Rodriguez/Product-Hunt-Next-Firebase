export default function validarCrearCuenta(valores) {
  let errores = {};

  //Validar del nombre del usuario
  if (!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }

  //validar empresa
  if (!valores.empresa) {
    errores.empresa = "El nombre de la Empresa en Obligatorio";
  }

  // validar la url
  if (!valores.url) {
    errores.url = "La URL del producto es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "URL no válida";
  }

  // validar descripción.
  if (!valores.descripcion) {
    errores.descripcion = "Agrega una descripción de tu producto";
  }

  return errores;
}
