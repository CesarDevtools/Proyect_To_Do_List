const tareaInput = document.getElementById('tareaInput');
const botonAgregar = document.getElementById('botonAgregar');
const listaTareas = document.getElementById('listaTareas');
const mensajeVacio = document.getElementById('mensajeVacio');
const botonFiltrar = document.getElementById('botonFiltrar')
const filtrosOpciones = document.getElementById('filtrosOpciones');
const filtroTodas = document.getElementById('filtroTodas')
const filtroCompletadas = document.getElementById('filtroCompletadas')
const filtroPendientes = document.getElementById('filtroPendientes')

// Función: muestra u oculta el mensaje de lista vacía
function actualizarMensajeVacio() {
  if (listaTareas.children.length === 0) {
    mensajeVacio.classList.add('mostrar');
  } else {
    mensajeVacio.classList.remove('mostrar');
  }
};


// Función: guarda tareas en localStorage
function guardarTareas() {
  const tareasArray = [];
  listaTareas.querySelectorAll('li').forEach(li => {
    tareasArray.push({
      texto: li.querySelector('span').textContent,
      completado: li.classList.contains('completado')
    });
  });
  localStorage.setItem('tareas', JSON.stringify(tareasArray));
  actualizarMensajeVacio();
  actualizarContadorTareas(); //Llamado para actualizar el contador.
};

// Función: cargar tareas guardadas
function cargarTareas() {
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas'));
  if (!tareasGuardadas) return actualizarMensajeVacio();

  tareasGuardadas.forEach((tareaObj, index) => {
    const li = document.createElement("li");

    const spanTexto = document.createElement("span");
    spanTexto.textContent = tareaObj.texto;
    li.appendChild(spanTexto);

    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    if (tareaObj.completado) li.classList.add("completado");

    // Aplica clase de animación y delay escalonado
    li.classList.add("fade-in");
    li.style.animationDelay = `${index * 100}ms`;

    // Elimina la clase fade-in al terminar la animación de entrada, para que luego puedo fucionar la animacion al eliminar
    li.addEventListener('animationend', function handler(e) {
      if (e.animationName === "fadeInSlide") {
      li.classList.remove('fade-in');
      li.removeEventListener('animationend', handler);
    }
    });

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "🗑";
    botonEliminar.classList.add("btn", "btn-outline-danger", "btn-sm");

    //Evento: eliminar tareas
    botonEliminar.addEventListener('click', (e) => {
      e.stopPropagation();
      li.classList.add('eliminando');
      setTimeout(() => {
      li.remove();
      guardarTareas();
      }, 300); // el tiempo debe coincidir con la animación CSS
    });


    //Evento: marcar tarea como completada
    li.addEventListener('click', (e) => {
    e.stopPropagation();
    li.classList.toggle('completado');
    guardarTareas();
    });

    li.appendChild(botonEliminar);
    listaTareas.appendChild(li);
  });

  actualizarMensajeVacio();
  actualizarContadorTareas();
};



// Evento: cargar tareas al iniciar
window.addEventListener('load', cargarTareas);


// Evento: agregar tarea
botonAgregar.addEventListener('click', () => {
  const tarea = tareaInput.value.trim();
  if (tarea !== "") {
    const li = document.createElement("li");
    const spanTexto = document.createElement("span");
    spanTexto.textContent = tarea;
    li.appendChild(spanTexto);
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    //Se crea el boton eliminar
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "🗑";
    botonEliminar.classList.add("btn", "btn-outline-danger", "btn-sm");

    //Evento: eliminar tarea
   botonEliminar.addEventListener('click', (e) => {
    e.stopPropagation();
    li.classList.add('eliminando');
    setTimeout(() => {
    li.remove();
    guardarTareas(); // ahora sí se ejecuta cuando el <li> ya no existe
    }, 300);
});


    //Evento: tachar tarea
  li.addEventListener('click', (e) => {
    e.stopPropagation();
    li.classList.toggle('completado');
    guardarTareas();
    });

    li.appendChild(botonEliminar);
    listaTareas.appendChild(li);
    tareaInput.value = "";
    guardarTareas();
  } else {
    alert('Campo vacío!');
  }
});

// Evento: Enter también agrega tarea
tareaInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    botonAgregar.click();
  }
});



//Evento: Mostrar menu de filtros
botonFiltrar.addEventListener('click', (e) => {    
  e.stopPropagation();
  filtrosOpciones.classList.toggle('d-none');
});

//Evento: Oculta el menú si haces click fuera
document.addEventListener('click', (e) => {
  if (!botonFiltrar.contains(e.target) && !filtrosOpciones.contains(e.target)) {
    filtrosOpciones.classList.add('d-none');
  }
});

//Evento: muestra todas las tareas
filtroTodas.addEventListener('click', () => {
  let algunoOculto = false;
  const items = listaTareas.querySelectorAll('li');
  items.forEach(li => {
    if (li.classList.contains('d-none')) {
      li.classList.remove('d-none');
      algunoOculto = true;
    }
  });
  // Si ninguno tenía d-none, no hace nada extra
});

//Evento: muestra solo las tareas completadas
filtroCompletadas.addEventListener('click', () => {
  const items = listaTareas.querySelectorAll('li');
  items.forEach(li => {
    if (li.classList.contains('completado')) {
      li.classList.remove('d-none');
    } else {
      li.classList.add('d-none');
    }
  });
});


//Evento: muestra solo las tareas pendientes
filtroPendientes.addEventListener('click', () => {
  const items = listaTareas.querySelectorAll('li');
  items.forEach(li => {
    if (li.classList.contains('completado')) {
      li.classList.add('d-none');
    } else {
      li.classList.remove('d-none');
   }
  });
});


//Funcion: Actualizar contador de tareas

function actualizarContadorTareas() {
  const items = listaTareas.querySelectorAll('li');
  let completadas = 0;
  let pendientes = 0;
  items.forEach(li => {
    if (li.classList.contains('completado')) {
      completadas++;
    } else {
      pendientes++;
    }
  });
  contadorTareas.textContent = `Pendientes: ${pendientes} | Completadas: ${completadas}`;
};