const tareaInput = document.getElementById('tareaInput');
const botonAgregar = document.getElementById('botonAgregar');
const listaTareas = document.getElementById('listaTareas');
const mensajeVacio = document.getElementById('mensajeVacio');

// Función: muestra u oculta el mensaje de lista vacía
function actualizarMensajeVacio() {
  mensajeVacio.style.display = listaTareas.children.length === 0 ? 'block' : 'none';
}

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

  tareasGuardadas.forEach(tareaObj => {
    const li = document.createElement("li");
    li.textContent = tareaObj.texto;
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    if (tareaObj.completado) li.classList.add('completado');

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "🗑";
    botonEliminar.classList.add("btn", "btn-outline-danger", "btn-sm");

    // Evento: eliminar tarea
    botonEliminar.addEventListener('click', (e) => {
      e.stopPropagation();
      li.remove();
      guardarTareas();
    });

    // Evento: marcar tarea completada
    li.addEventListener('click', () => {
      li.classList.toggle('completado');
      guardarTareas();
    });

    li.appendChild(botonEliminar);
    listaTareas.appendChild(li);
  });

  actualizarMensajeVacio(); 
}

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
      li.remove();
      guardarTareas();
    });

    //Evento: tachar tarea
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

// Evento: Enter también agrega tarea
tareaInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    botonAgregar.click();
  }
});




