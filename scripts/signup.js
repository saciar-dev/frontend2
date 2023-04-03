window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   const nombre = document.getElementById("inputNombre");
   const apellido = document.getElementById("inputApellido");
   const email = document.getElementById("inputEmail");
   const password = document.getElementById("inputPassword");
   const passwordRep = document.getElementById("inputPasswordRepetida");
   const form = document.querySelector("form");

   let errores = []; 

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        errores = [];
        if (!compararContrasenias(password.value, passwordRep.value))
            errores.push("Las contraseñas no coinciden");
        if(!validarEmail(email.value)){
            errores.push("El email tiene un formato incorrecto")
        }
        if(!validarContrasenia(password.value))
            errores.push("La contraseña debe ser mayor a 5 caracteres y no debe contener espacios en blanco");
        if(errores.length <= 0){
            const datos = {
                firstName: nombre.value,
                lastName: apellido.value,
                email: email.value,
                password: password.value
            }

            const settings = {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(datos)
            }

            realizarRegister(settings);
        }
        else{
            alert(errores);
        }
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        fetch("https://todo-api.ctd.academy/v1/users",settings)
        .then(function(resp){
            if(!resp.ok){
                switch (resp.status) {
                    case 400: {
                        alert("El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto");
                        break;
                }
                    case 500: 
                        alert("Error del servidor");
                        break;                      
                    default:
                        break;
                }
            }
            return resp.json();
        })
        .then(function(data){
            console.log(data);
            if(data.jwt){
                localStorage.setItem("jwt", data.jwt);
                location.replace("./index.html");
            }
        })
        .catch(function(e){
            console.log(e);
        })
    };


});