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
        if(validarEmail(email.value) && validarContrasenia(pass.value)){
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


    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
       
        fetch("https://todo-api.ctd.academy/v1/users/login", settings)
            .then(function(resp){
                if(!resp.ok){
                    switch (resp.status) {
                        case 400: 
                            alert("Contraseña incorrecta");
                            break;
                        case 404: 
                            alert("El usuario no existe");
                            break;
                        case 500: 
                            alert("Error del servidor");
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
                console.log(e.message);
            })

        
    };


});