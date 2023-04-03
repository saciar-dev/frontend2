/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
  let regex = /^[a-zA-Z]+$/;
  return regex.test(texto);
}

function normalizarTexto(texto) {
  return texto.normalize();
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    let regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if (!regex.test(email)) {
      console.log("error de email "+email);
      return false;
    }
    else
      return true;
}

function normalizarEmail(email) {
    const noramlizado = email.trim();
    return noramlizado.toLowerCase();
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    if (contrasenia.length < 5 || contrasenia === "") {
        console.log("error de password");
        return false;
      }
      else return true;
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    return contrasenia_1 === contrasenia_2;
}

