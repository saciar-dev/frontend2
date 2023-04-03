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
        if (!compararContrasenias(password.value, passwordRep.value)){
            errores.push("Las contraseñas no coinciden");
            passwordRep.classList.add("error");
        }
        if(!validarEmail(email.value)){
            errores.push("El email tiene un formato incorrecto")
            email.classList.add("error");
        }
        if(!validarContrasenia(password.value)){
            errores.push("La contraseña debe ser mayor a 5 caracteres y no debe contener espacios en blanco");
            password.classList.add("error");
        }
        if(!validarTexto(nombre.value)){
            errores.push("Utilice solo letras para el nombre");
            nombre.classList.add("error");
        }
        if(!validarTexto(apellido.value)){
            errores.push("Utilice solo letras para el apellido");
            apellido.classList.add("error");
        }
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
            // alert(errores);
            let lista = "";
            errores.forEach(element => {
                lista+='<li>'+element+'</li>'
            });
            Swal.fire({
                title: '<strong>Error!</strong>',
                icon: 'error',
                html:
                  `<ul>${lista}</ul>`,
                focusConfirm: false,
                confirmButtonText: 'Cerrar'
              })
        }
    });

    nombre.addEventListener('blur', (evt) =>{
        if(!validarTexto(nombre.value)){
            nombre.classList.add("error");
        }
        else{
            nombre.classList.remove("error");
        }
    })

    apellido.addEventListener('blur', (evt) =>{
        if(!validarTexto(apellido.value)){
            apellido.classList.add("error");
        }
        else{
            apellido.classList.remove("error");
        }
    })

    email.addEventListener('blur', (evt) =>{
        if(!validarEmail(email.value)){
            email.classList.add("error");
        }
        else{
            email.classList.remove("error");
        }
    })

    password.addEventListener('blur', (evt) =>{
        if(!validarContrasenia(password.value)){
            password.classList.add("error");
        }
        else{
            password.classList.remove("error");
        }
    })

    passwordRep.addEventListener('blur', (evt) =>{
        if(!compararContrasenias(password.value, passwordRep.value)){
            passwordRep.classList.add("error");
        }
        else{
            passwordRep.classList.remove("error");
        }
    })

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        fetch("https://todo-api.ctd.academy/v1/users",settings)
        .then(function(resp){
            if(!resp.ok){
                switch (resp.status) {
                    case 400: {
                    //  alert("El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto");
                        Swal.fire({
                            title: '<strong>Error</strong>',
                            icon: 'error',
                            html:
                            `El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto`,
                            focusConfirm: false,
                            confirmButtonText: 'Cerrar'
                        })
                        break;
                }
                    case 500: 
                        Swal.fire({
                            title: '<strong>Error</strong>',
                            icon: 'error',
                            html:
                            `Error del servidor`,
                            focusConfirm: false,
                            confirmButtonText: 'Cerrar'
                        })
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
            // console.log(e);
            Swal.fire({
                title: '<strong>Error</strong>',
                icon: 'error',
                html:
                e.message,
                focusConfirm: false,
                confirmButtonText: 'Cerrar'
            })
        })
    };


});