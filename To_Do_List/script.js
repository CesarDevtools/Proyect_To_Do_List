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
const tareaTitulo = document.getElementById('tareaTitulo');
const tareaCategoria = document.getElementById('tareaCategoria');
const contadorTareas = document.getElementById('contadorTareas');


// Restaurar tema guardado
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'oscuro') {
  document.body.classList.remove('bg-white', 'text-dark');
  document.body.classList.add('bg-dark', 'text-light');
} else {
  document.body.classList.remove('bg-dark', 'text-light');
  document.body.classList.add('bg-white', 'text-dark');
}

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
    const divSuperior = li.querySelector('div');
    const spanTitulo = divSuperior ? divSuperior.querySelector('span.fw-bold') : null;
    const spanCategoria = divSuperior ? divSuperior.querySelector('span.badge') : null;
    const divDescripcion = li.querySelector('div.small');
    tareasArray.push({
      titulo: spanTitulo ? spanTitulo.textContent : '',
      categoria: spanCategoria ? spanCategoria.textContent : '',
      descripcion: divDescripcion ? divDescripcion.textContent : '',
      completado: li.classList.contains('completado')
    });
  });
  localStorage.setItem('tareas', JSON.stringify(tareasArray));
  actualizarMensajeVacio();
  actualizarContadorTareas();
};

// Carga tareas guardadas desde localStorage
function cargarTareas() {
  listaTareas.innerHTML = ""; // Limpia la lista antes de cargar
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas'));
  if (!tareasGuardadas) return actualizarMensajeVacio();

  tareasGuardadas.forEach((tareaObj, index) => {
    const li = document.createElement("li");
    li.setAttribute('draggable', true);

    // Drag & drop
    li.addEventListener('dragstart', (e) => {
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
    });

  // Doble click para editar
  li.addEventListener('dblclick', () => {
    li.setAttribute('draggable', false);
    // Obtener los valores actuales
    const divSuperior = li.querySelector('div');
    const spanTitulo = divSuperior.querySelector('span.fw-bold');
    const spanCategoria = divSuperior.querySelector('span.badge');
    const divDescripcion = li.querySelector('div.small');

    // Crear inputs para edición
    const inputTitulo = document.createElement('input');
    inputTitulo.type = 'text';
    inputTitulo.value = spanTitulo.textContent;
    inputTitulo.className = 'form-control mb-2';

    const selectCategoria = document.createElement('select');
    selectCategoria.className = 'form-select mb-2';
    ['Hogar', 'Salud', 'Trabajo', 'Importante'].forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      if (spanCategoria.textContent === cat) option.selected = true;
      selectCategoria.appendChild(option);
    });

    const inputDescripcion = document.createElement('input');
    inputDescripcion.type = 'text';
    inputDescripcion.value = divDescripcion ? divDescripcion.textContent : '';
    inputDescripcion.className = 'form-control mb-2';

    // Botón guardar
    const btnGuardar = document.createElement('button');
    btnGuardar.textContent = 'Guardar';
    btnGuardar.className = 'btn btn-success btn-sm';

    // Limpiar el li y agregar los inputs
    li.innerHTML = '';
    li.appendChild(inputTitulo);
    li.appendChild(selectCategoria);
    li.appendChild(inputDescripcion);
    li.appendChild(btnGuardar);

    // Keydown para guardar al presionar Enter
    [inputTitulo, inputDescripcion].forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          btnGuardar.click();
        }
      });
    });

    btnGuardar.addEventListener('click', () => {
      li.setAttribute('draggable', true); // Reactiva drag and drop
      guardarTareas();
      // Validar
      if (inputTitulo.value.trim() === '' || selectCategoria.value === '') {
        alert('Título y categoría son obligatorios');
        return;
      }
      // Actualizar valores
      spanTitulo.textContent = inputTitulo.value.trim();
      spanCategoria.textContent = selectCategoria.value;
      spanCategoria.className = `badge ms-2 ${obtenerClaseCategoria(selectCategoria.value)}`;
      if (inputDescripcion.value.trim() !== '') {
        if (!divDescripcion) {
          const nuevaDescripcion = document.createElement('div');
          nuevaDescripcion.className = 'small text-muted mt-1';
          nuevaDescripcion.textContent = inputDescripcion.value.trim();
          li.appendChild(nuevaDescripcion);
        } else {
          divDescripcion.textContent = inputDescripcion.value.trim();
        }
      } else if (divDescripcion) {
        divDescripcion.remove();
      }

      // Restaurar estructura original
      const divSuperiorNuevo = document.createElement('div');
      divSuperiorNuevo.appendChild(spanTitulo);
      divSuperiorNuevo.appendChild(spanCategoria);
      li.innerHTML = '';
      li.appendChild(divSuperiorNuevo);
      if (inputDescripcion.value.trim() !== '') {
        const nuevaDescripcion = document.createElement('div');
        nuevaDescripcion.className = 'small text-muted mt-1';
        nuevaDescripcion.textContent = inputDescripcion.value.trim();
        li.appendChild(nuevaDescripcion);
      }
      li.classList.add("list-group-item", "d-flex", "flex-column", "align-items-start");

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.className = "btn btn-sm position-absolute top-0 end-0  text-danger";
      btnEliminar.style.zIndex = "2";
      btnEliminar.addEventListener('click', (e) => {
        e.stopPropagation();
        li.classList.add('eliminando');
        setTimeout(() => {
          li.remove();
          guardarTareas();
        }, 300);
      });
      li.appendChild(btnEliminar);

      guardarTareas();
    });
  });

    // Título
    const spanTitulo = document.createElement("span");
    spanTitulo.textContent = tareaObj.titulo || '';
    spanTitulo.classList.add("fw-bold", "me-2");

    // Categoría
    const spanCategoria = document.createElement("span");
    spanCategoria.textContent = tareaObj.categoria || '';
    spanCategoria.className = `badge ms-2 ${obtenerClaseCategoria(tareaObj.categoria)}`;

    // Línea superior: título + categoría
    const divSuperior = document.createElement("div");
    divSuperior.appendChild(spanTitulo);
    divSuperior.appendChild(spanCategoria);

    // Descripción (opcional)
    let divDescripcion = null;
    if (tareaObj.descripcion) {
      divDescripcion = document.createElement("div");
      divDescripcion.textContent = tareaObj.descripcion;
      divDescripcion.classList.add("small", "text-muted", "mt-1");
    }

    li.appendChild(divSuperior);
    if (divDescripcion) li.appendChild(divDescripcion);

    li.classList.add("list-group-item", "d-flex", "flex-column", "align-items-start");
    if (tareaObj.completado) li.classList.add("completado");

    // Botón eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar"; // equis
    btnEliminar.className = "btn btn-sm position-absolute top-0 end-0 text-danger";
    btnEliminar.style.zIndex = "2";
    btnEliminar.addEventListener('click', (e) => {
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

    li.classList.add("position-relative");
    li.appendChild(btnEliminar);
    listaTareas.appendChild(li);
  });

  actualizarMensajeVacio();
  actualizarContadorTareas();
};

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

// Colores de categorías
// Esta función devuelve la clase CSS correspondiente a cada categoría
function obtenerClaseCategoria(categoria) {
  switch (categoria) {
    case 'Hogar':
      return 'bg-purple text-white';      // Morado
    case 'Salud':
      return 'bg-success text-white';     // Verde
    case 'Trabajo':
      return 'bg-info text-dark';         // Turquesa
    case 'Importante':
      return 'bg-danger text-white';      // Rojo
    default:
      return 'bg-secondary text-white';
  }
};











// =======================
// Eventos principales
// =======================

// Al cargar la página, cargar tareas
window.addEventListener('load', cargarTareas);

// Agregar tarea
botonAgregar.addEventListener('click', () => {
  const titulo = tareaTitulo.value.trim();
  const categoria = tareaCategoria.value;
  const descripcion = tareaInput.value.trim();

  if (titulo !== "" && categoria !== "") {
    const li = document.createElement("li");
    li.setAttribute('draggable', true);

    // Drag & drop
    li.addEventListener('dragstart', (e) => {
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
    });
  
  // Evento para editar tarea al hacer doble clic
  li.addEventListener('dblclick', () => {
    li.setAttribute('draggable', false);
    // Obtener los valores actuales
    const divSuperior = li.querySelector('div');
    const spanTitulo = divSuperior.querySelector('span.fw-bold');
    const spanCategoria = divSuperior.querySelector('span.badge');
    const divDescripcion = li.querySelector('div.small');

    // Crear inputs para edición
    const inputTitulo = document.createElement('input');
    inputTitulo.type = 'text';
    inputTitulo.value = spanTitulo.textContent;
    inputTitulo.className = 'form-control mb-2';

    const selectCategoria = document.createElement('select');
    selectCategoria.className = 'form-select mb-2';
    ['Hogar', 'Salud', 'Trabajo', 'Importante'].forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      if (spanCategoria.textContent === cat) option.selected = true;
      selectCategoria.appendChild(option);
    });

    const inputDescripcion = document.createElement('input');
    inputDescripcion.type = 'text';
    inputDescripcion.value = divDescripcion ? divDescripcion.textContent : '';
    inputDescripcion.className = 'form-control mb-2';

    // Botón guardar
    const btnGuardar = document.createElement('button');
    btnGuardar.textContent = 'Guardar';
    btnGuardar.className = 'btn btn-success btn-sm';

    // Limpiar el li y agregar los inputs
    li.innerHTML = '';
    li.appendChild(inputTitulo);
    li.appendChild(selectCategoria);
    li.appendChild(inputDescripcion);
    li.appendChild(btnGuardar);

    // Keydown para guardar al presionar Enter
    [inputTitulo, inputDescripcion].forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          btnGuardar.click();
        }
      });
    });

    // Evento para guardar cambios
    btnGuardar.addEventListener('click', () => {
      li.setAttribute('draggable', true); // Reactiva drag and drop
      guardarTareas();
      // Validar
      if (inputTitulo.value.trim() === '' || selectCategoria.value === '') {
        alert('Título y categoría son obligatorios');
        return;
      }
      // Actualizar valores
      spanTitulo.textContent = inputTitulo.value.trim();
      spanCategoria.textContent = selectCategoria.value;
      spanCategoria.className = `badge ms-2 ${obtenerClaseCategoria(selectCategoria.value)}`;
      if (inputDescripcion.value.trim() !== '') {
        if (!divDescripcion) {
          const nuevaDescripcion = document.createElement('div');
          nuevaDescripcion.className = 'small text-muted mt-1';
          nuevaDescripcion.textContent = inputDescripcion.value.trim();
          li.appendChild(nuevaDescripcion);
        } else {
          divDescripcion.textContent = inputDescripcion.value.trim();
        }
      } else if (divDescripcion) {
        divDescripcion.remove();
      }

      // Restaurar estructura original
      const divSuperiorNuevo = document.createElement('div');
      divSuperiorNuevo.appendChild(spanTitulo);
      divSuperiorNuevo.appendChild(spanCategoria);
      li.innerHTML = '';
      li.appendChild(divSuperiorNuevo);
      if (inputDescripcion.value.trim() !== '') {
        const nuevaDescripcion = document.createElement('div');
        nuevaDescripcion.className = 'small text-muted mt-1';
        nuevaDescripcion.textContent = inputDescripcion.value.trim();
        li.appendChild(nuevaDescripcion);
      }
      li.classList.add("list-group-item", "d-flex", "flex-column", "align-items-start");

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.className = "btn btn-sm position-absolute top-0 end-0  text-danger";
      btnEliminar.style.zIndex = "2";
      btnEliminar.addEventListener('click', (e) => {
        e.stopPropagation();
        li.classList.add('eliminando');
        setTimeout(() => {
          li.remove();
          guardarTareas();
        }, 300);
      });
      li.appendChild(btnEliminar);

      guardarTareas();
    });
  });

    // Título
    const spanTitulo = document.createElement("span");
    spanTitulo.textContent = titulo;
    spanTitulo.classList.add("fw-bold", "me-2");

    // Categoría
    const spanCategoria = document.createElement("span");
    spanCategoria.textContent = categoria;
    spanCategoria.className = `badge ms-2 ${obtenerClaseCategoria(categoria)}`;

    // Línea superior: título + categoría
    const divSuperior = document.createElement("div");
    divSuperior.appendChild(spanTitulo);
    divSuperior.appendChild(spanCategoria);

    // Descripción (opcional)
    let divDescripcion = null;
    if (descripcion) {
      divDescripcion = document.createElement("div");
      divDescripcion.textContent = descripcion;
      divDescripcion.classList.add("small", "text-muted", "mt-1");
    }

    li.appendChild(divSuperior);
    if (divDescripcion) li.appendChild(divDescripcion);

    li.classList.add("list-group-item", "d-flex", "flex-column", "align-items-start");

    // Botón eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar"; // equis
    btnEliminar.className = "btn btn-sm position-absolute top-0 end-0  text-danger";
    btnEliminar.style.zIndex = "2";
    btnEliminar.addEventListener('click', (e) => {
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

    li.classList.add("position-relative");
    li.appendChild(btnEliminar);
    listaTareas.appendChild(li);

    // Limpiar inputs
    tareaTitulo.value = "";
    tareaCategoria.value = "";
    tareaInput.value = "";
    guardarTareas();
  } else {
    alert('Título y categoría son obligatorios');
  }
});

// Agregar tarea con Enter
tareaInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    botonAgregar.click();
  }
});

tareaTitulo.addEventListener('keydown', (e) => {
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

// Cambiar tema claro
document.getElementById('themeLight').addEventListener('click', function(e) {
  e.preventDefault();
  document.body.classList.remove('bg-dark', 'text-light');
  document.body.classList.add('bg-white', 'text-dark');
  localStorage.setItem('tema', 'claro');
});

// Cambiar tema oscuro
document.getElementById('themeDark').addEventListener('click', function(e) {
  e.preventDefault();
  document.body.classList.remove('bg-white', 'text-dark');
  document.body.classList.add('bg-dark', 'text-light');
  localStorage.setItem('tema', 'oscuro');
});



