// =======================
// Variables globales
// =======================
const tareaInput = document.getElementById('tareaInput');
const botonAgregar = document.getElementById('botonAgregar');
const listaTareas = document.getElementById('listaTareas');
const mensajeVacio = document.getElementById('mensajeVacio');
const botonFiltrar = document.getElementById('botonFiltrar');
const filtrosOpciones = document.getElementById('filtrosOpciones');
const filtroTodas = document.getElementById('filtroTodas');
const filtroCompletadas = document.getElementById('filtroCompletadas');
const filtroPendientes = document.getElementById('filtroPendientes');


// =======================
// Funciones principales
// =======================

// Muestra u oculta el mensaje de lista vacía
function actualizarMensajeVacio() {
  if (listaTareas.children.length === 0) {
    mensajeVacio.classList.add('mostrar');
  } else {
    mensajeVacio.classList.remove('mostrar');
  }
}

// Guarda tareas en localStorage y actualiza contador
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
  actualizarContadorTareas();
}

// Carga tareas guardadas desde localStorage
function cargarTareas() {
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas'));
  if (!tareasGuardadas) return actualizarMensajeVacio();

  tareasGuardadas.forEach((tareaObj, index) => {
    const li = document.createElement("li");
    li.setAttribute('draggable', true);
    
    li.addEventListener('dragstart', (e) => {
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      });

    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      });
      
    const spanTexto = document.createElement("span");
    spanTexto.textContent = tareaObj.texto;
    li.appendChild(spanTexto);

    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    if (tareaObj.completado) li.classList.add("completado");

    // Animación de entrada
    li.classList.add("fade-in");
    li.style.animationDelay = `${index * 100}ms`;
    li.addEventListener('animationend', function handler(e) {
      if (e.animationName === "fadeInSlide") {
        li.classList.remove('fade-in');
        li.removeEventListener('animationend', handler);
      }
    });

    // Botón eliminar
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "🗑";
    botonEliminar.classList.add("btn", "btn-outline-danger", "btn-sm");
    botonEliminar.addEventListener('click', (e) => {
      e.stopPropagation();
      li.classList.add('eliminando');
      setTimeout(() => {
        li.remove();
        guardarTareas();
      }, 300);
    });

    // Evento: marcar como completada
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
}

// Actualiza el contador de tareas
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

// Función auxiliar
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: -Infinity }).element;
};


// =======================
// Eventos principales
// =======================

// Al cargar la página, cargar tareas
window.addEventListener('load', cargarTareas);

// Agregar tarea
botonAgregar.addEventListener('click', () => {
  const tarea = tareaInput.value.trim();
  if (tarea !== "") {
    const li = document.createElement("li");
    li.setAttribute('draggable', true);

li.addEventListener('dragstart', (e) => {
  li.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
});

li.addEventListener('dragend', () => {
  li.classList.remove('dragging');
});
    const spanTexto = document.createElement("span");
    spanTexto.textContent = tarea;
    li.appendChild(spanTexto);
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    // Botón eliminar
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "🗑";
    botonEliminar.classList.add("btn", "btn-outline-danger", "btn-sm");
    botonEliminar.addEventListener('click', (e) => {
      e.stopPropagation();
      li.classList.add('eliminando');
      setTimeout(() => {
        li.remove();
        guardarTareas();
      }, 300);
    });

    // Evento: marcar como completada
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

// Agregar tarea con Enter
tareaInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    botonAgregar.click();
  }
});

// Mostrar menú de filtros
botonFiltrar.addEventListener('click', (e) => {
  e.stopPropagation();
  filtrosOpciones.classList.toggle('d-none');
});

// Ocultar menú de filtros al hacer click fuera
document.addEventListener('click', (e) => {
  if (!botonFiltrar.contains(e.target) && !filtrosOpciones.contains(e.target)) {
    filtrosOpciones.classList.add('d-none');
  }
});

// Filtros
filtroTodas.addEventListener('click', () => {
  const items = listaTareas.querySelectorAll('li');
  items.forEach(li => li.classList.remove('d-none'));
});

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

// Permitir soltar sobre la lista
listaTareas.addEventListener('dragover', (e) => {
  e.preventDefault();
  const dragging = document.querySelector('.dragging');
  const afterElement = getDragAfterElement(listaTareas, e.clientY);
  if (afterElement == null) {
    listaTareas.appendChild(dragging);
  } else {
    listaTareas.insertBefore(dragging, afterElement);
  }
});

// Guardar el nuevo orden al soltar
listaTareas.addEventListener('drop', () => {
  guardarTareas();
});

