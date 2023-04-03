window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   const email = document.getElementById("inputEmail");
   const pass = document.getElementById("inputPassword");
   const form = document.querySelector("form");

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {

        event.preventDefault();
        let errores = [];

        if(!validarEmail(email.value)){
            errores.push("El email tiene un formato incorrecto");
            email.classList.add("error");
        }
        if(!validarContrasenia(pass.value)){
            errores.push("La contraseña debe ser mayor a 5 caracteres y no debe contener espacios en blanco");
            pass.classList.add("error");
        }
        if(errores.length <= 0){
            const user = {
                email: email.value,
                password: pass.value
            }

            const setting = {
                "method": "POST",
                "headers": {
                    "content-type": "application/json"
                },
                "body": JSON.stringify(user)
            }

            realizarLogin(setting);
        }
        else{
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

    email.addEventListener('blur', () =>{
        if(!validarEmail(email.value)){
            email.classList.add("error");
        }
        else{
            email.classList.remove("error");
        }
    })

    pass.addEventListener('blur', () =>{
        if(!validarContrasenia(pass.value)){
            pass.classList.add("error");
        }
        else{
            pass.classList.remove("error");
        }
    })


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
       
        fetch("https://todo-api.ctd.academy/v1/users/login", settings)
            .then(function(resp){
                if(!resp.ok){
                    switch (resp.status) {
                        case 400: 
                            // alert("Contraseña incorrecta");
                            Swal.fire({
                                title: '<strong>Error</strong>',
                                icon: 'error',
                                html:
                                `Contraseña incorrecta`,
                                focusConfirm: false,
                                confirmButtonText: 'Cerrar'
                            })
                            break;
                        case 404: 
                            // alert("El usuario no existe");
                            Swal.fire({
                                title: '<strong>Error</strong>',
                                icon: 'error',
                                html:
                                `El usuario no existe`,
                                focusConfirm: false,
                                confirmButtonText: 'Cerrar'
                            })
                            break;
                        case 500: 
                            // alert("Error del servidor");
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
            .then( function(data){
                console.log(data);
                if(data.jwt){
                    localStorage.setItem("jwt", data.jwt);
                    location.replace("./mis-tareas.html");
                }
            })
            .catch(function(e){
                // console.log(e.message);
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