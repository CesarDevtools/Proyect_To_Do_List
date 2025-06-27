const tareaInput = document.getElementById('tareaInput');
const botonAgregar = document.getElementById('botonAgregar');
const listaTareas = document.getElementById('listaTareas');
const mensajeVacio = document.getElementById('mensajeVacio');

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

    // Elimina la clase fade-in al terminar la animación de entrada
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




