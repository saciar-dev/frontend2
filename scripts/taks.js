// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

if(!localStorage.getItem("jwt")){
  location.replace('./index.html');
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  AOS.init();

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion  = document.getElementById("closeApp");   
  const formCrearTarea = document.querySelector("form");
  const nombreUsuario = document.querySelector(".user-info p");

  const tareasPendiente = document.querySelector(".tareas-pendientes");
  const tareasTerminadas = document.querySelector(".tareas-terminadas");

  const main = document.querySelector("main");

  const contTareFinalizadas = document.getElementById("cantidad-finalizadas");

  let contadorFinalizadas = 0;

  obtenerNombreUsuario();
  consultarTareas();
  botonesCambioEstado();
  botonBorrarTarea();

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    if (localStorage.getItem("jwt") != null) {
      Swal.fire({
        title: '¿Esta seguro de cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("jwt");
          location.replace("./index.html");
        }
      })
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {

  const setting = {
      "method": "GET",
      "headers": {
          "authorization": localStorage.getItem("jwt")
      }
  }

   fetch("https://todo-api.ctd.academy/v1/users/getMe", setting)
    .then(function(resp){
      if(!resp.ok){
        switch (resp.status) {
            case 404: 
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
      // console.log(data);
      if(data.firstName != null){
        nombreUsuario.innerText = data.firstName + " " +data.lastName;
      }
    })
     .catch(function (e) {
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


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    
    const setting = {
      "method": "GET",
      "headers": {
        "authorization": localStorage.getItem("jwt")
      }
    }

    fetch("https://todo-api.ctd.academy/v1/tasks", setting)
    .then(function(resp){
      if(!resp.ok){
        switch (resp.status) {
          case 401:
            Swal.fire({
              title: '<strong>Error</strong>',
              icon: 'error',
              html:
                `Requiere Autorización`,
              focusConfirm: false,
              confirmButtonText: 'Cerrar'
            })
            break;
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
      if(data != null){
        renderizarTareas(data);
      }
    })
    .catch(function (e) {
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


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {

    event.preventDefault();

    const descripcion = document.getElementById("nuevaTarea");

    const nuevaTarea = {
      description: descripcion.value,
      completed: false
    }

    const setting = {
      method: "POST",
      headers: {
        "authorization": localStorage.getItem("jwt"),
        "content-type": "application/json"
      },
      body: JSON.stringify(nuevaTarea)
    }

    fetch("https://todo-api.ctd.academy/v1/tasks",setting)
      .then(function(resp){
        if(!resp.ok){
          switch (resp.status) {
            case 400:
              Swal.fire({
                title: '<strong>Error</strong>',
                icon: 'error',
                html:
                `Alguno de los datos requeridos está incompleto`,
                focusConfirm: false,
                confirmButtonText: 'Cerrar'
              })
              break;
            case 401:
              Swal.fire({
                title: '<strong>Error</strong>',
                icon: 'error',
                html:
                  `Requiere Autorización`,
                focusConfirm: false,
                confirmButtonText: 'Cerrar'
              })
              break;
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
        consultarTareas();
        formCrearTarea.reset();
      })
      .catch(function (e) {
        Swal.fire({
          title: '<strong>Error</strong>',
          icon: 'error',
          html:
            e.message,
          focusConfirm: false,
          confirmButtonText: 'Cerrar'
        })
      })

  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    tareasPendiente.innerHTML = "";
    tareasTerminadas.innerHTML = "";   

    contadorFinalizadas=0;
    contTareFinalizadas.innerText = contadorFinalizadas;

    listado.forEach(tarea => {

      let fecha = new Date(tarea.createdAt);

      if(!tarea.completed){

      tareasPendiente.innerHTML += `<li class="tarea" data-aos="fade-right"
      data-aos-offset="300"
      data-aos-easing="ease-in-sine">                                  
        <button class="change" id="${tarea.id}">
          <i class="fa-regular fa-circle"></i>
        </button>                         
        <div class="descripcion ">                                
          <p class="nombre">${tarea.description}</p> 
          <p class="timestamp">${fecha.toLocaleDateString()}</p>
        </div>
        </li>`;
      }
      else{
        contadorFinalizadas++;
        contTareFinalizadas.innerText = contadorFinalizadas;
        tareasTerminadas.innerHTML += `<li class="tarea" data-aos="flip-down">
        <div class="hecha">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <div class="cambios-estados">
            <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
            <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </li>`;
      }
    });

  };

  

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    
    main.addEventListener('click', (evt) => {

      const idTarea = evt.target.id;
      const payload = {};
  
      if (evt.target.classList.contains("change")) {
        payload.completed = true;

        if (evt.target.classList.contains("incompleta")) {          
          payload.completed = false;
        }
  
        const setting = {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem("jwt")
          },
          body: JSON.stringify(payload)
        }
  
        fetch("https://todo-api.ctd.academy/v1/tasks/" + idTarea, setting)
          .then(function (resp) {
            if (!resp.ok) {
              switch (resp.status) {
                case 400:
                  Swal.fire({
                    title: '<strong>Error</strong>',
                    icon: 'error',
                    html:
                      `ID Inválido`,
                    focusConfirm: false,
                    confirmButtonText: 'Cerrar'
                  })
                  break;
                case 401:
                  Swal.fire({
                    title: '<strong>Error</strong>',
                    icon: 'error',
                    html:
                      `Requiere Autorización`,
                    focusConfirm: false,
                    confirmButtonText: 'Cerrar'
                  })
                  break;
                case 404:
                  Swal.fire({
                    title: '<strong>Error</strong>',
                    icon: 'error',
                    html:
                      `Tarea inexistente`,
                    focusConfirm: false,
                    confirmButtonText: 'Cerrar'
                  })
                  break;
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
          .then(function (data) {
            if (data.id != null) {
              console.log(data);
              consultarTareas();
            }
          })
          .catch(function (e) {
            Swal.fire({
              title: '<strong>Error</strong>',
              icon: 'error',
              html:
                e.message,
              focusConfirm: false,
              confirmButtonText: 'Cerrar'
            })
          })
      }
    })
  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
   
    tareasTerminadas.addEventListener('click', (evt) => {

      const idTarea = evt.target.id;

      if (evt.target.classList.contains("borrar")) {    

        Swal.fire({
          title: 'Esta seguro de eliminar esta tarea?',
          text: "No se puede revertir este cambio",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3333ffff',
          cancelButtonColor: '#ff7059ff',
          confirmButtonText: 'Si, eliminarla'
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("borrando....");
        const setting = {
          method: "DELETE",
          headers: {
            // "content-type": "application/json",
            "authorization": localStorage.getItem("jwt")
          }
        }
  
        fetch("https://todo-api.ctd.academy/v1/tasks/" + idTarea, setting)
          .then(function (resp) {
            if (!resp.ok) {
              switch (resp.status) {
                case 400:
                  Swal.fire({
                    title: '<strong>Error</strong>',
                    icon: 'error',
                    html:
                      `ID Inválido`,
                    focusConfirm: false,
                    confirmButtonText: 'Cerrar'
                  })
                  break;
                case 401:
                  Swal.fire({
                    title: '<strong>Error</strong>',
                    icon: 'error',
                    html:
                      `Requiere Autorización`,
                    focusConfirm: false,
                    confirmButtonText: 'Cerrar'
                  })
                  break;
                case 404:
                  Swal.fire({
                    title: '<strong>Error</strong>',
                    icon: 'error',
                    html:
                      `Tarea inexistente`,
                    focusConfirm: false,
                    confirmButtonText: 'Cerrar'
                  })
                  break;
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
          .then(function (data) {
            
              console.log(data);
              Swal.fire(
                'Eliminado!',
                'La tarea ha sido borrada',
                'success'
              )
              consultarTareas();
            
          })
          .catch(function (e) {
            Swal.fire({
              title: '<strong>Error</strong>',
              icon: 'error',
              html:
                e.message,
              focusConfirm: false,
              confirmButtonText: 'Cerrar'
            })
          })
          }
        })
      }
    })

  };

});