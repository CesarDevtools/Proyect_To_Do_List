const tareaInput = document.getElementById('tareaInput');
const botonAgregar = document.getElementById('botonAgregar');
const listaTareas = document.getElementById('listaTareas');
const mensajeVacio = document.getElementById('mensajeVacio');

// Función: muestra u oculta el mensaje de lista vacía
function actualizarMensajeVacio() {
  mensajeVacio.style.display = listaTareas.children.length === 0 ? 'block' : 'none';
}

// Función: guarda las tareas en localStorage
function guardarTareas() {
  const tareasArray = [];
  listaTareas.querySelectorAll('li').forEach(li => {
    tareasArray.push({
      texto: li.firstChild.textContent,
      completado: li.classList.contains('completado')
    });
  });
  localStorage.setItem('tareas', JSON.stringify(tareasArray));
  actualizarMensajeVacio();
}

// Función: carga tareas desde localStorage
function cargarTareas() {
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas'));
  if (!tareasGuardadas) return actualizarMensajeVacio();

  tareasGuardadas.forEach(tareaObj => {
    const li = document.createElement("li");
    li.textContent = tareaObj.texto;
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    if (tareaObj.completado) {
      li.classList.add('completado');
    }

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");

    // Evento: eliminar tarea
    botonEliminar.addEventListener('click', (e) => {
      e.stopPropagation();
      li.remove();
      guardarTareas();
    });

    // Evento: marcar tarea como completada
    li.addEventListener('click', () => {
      li.classList.toggle('completado');
      guardarTareas();
    });

    li.appendChild(botonEliminar);
    listaTareas.appendChild(li);
  });

  actualizarMensajeVacio();
}

// Evento: cargar tareas al iniciar la página
window.addEventListener('load', cargarTareas);

// Evento: agregar tarea al hacer clic en el botón
botonAgregar.addEventListener('click', () => {
  const tarea = tareaInput.value.trim();

  if (tarea !== "") {
    const li = document.createElement("li");
    li.textContent = tarea;
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");

    // Evento: eliminar tarea
    botonEliminar.addEventListener('click', (e) => {
      e.stopPropagation();
      li.remove();
      guardarTareas();
    });

    // Evento: marcar tarea como completada
    li.addEventListener('click', () => {
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

// Evento: permitir agregar tarea con Enter
tareaInput.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    botonAgregar.click();
  }
});



