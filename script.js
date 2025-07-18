// IMPORTACIONES
import { lista, guardarStorage, cargarStorage } from "./lista.js";
import { inicializarUI } from "./ui.js";

// Variables para las funciones de UI
let uiFunciones;

// ELEMENTOS DEL DOM
const inputTareaTitulo = document.getElementById('tareaTitulo');
const inputTareaDescripcion = document.getElementById('tareaDescripcion');
const selectTareaCategoria = document.getElementById('tareaCategoria');
const botonAgregar = document.getElementById('botonAgregar');
const mensajeVacio = document.getElementById('mensajeVacio');
const contadorTareas = document.getElementById('contadorTareas');
const contenedorLista = document.getElementById('contenedorTareas');

// ===================================================
// ACTUALIZAR CONTADOR DE TAREAS
// ===================================================

// Actualiza el contador de tareas
function actualizarContadorTareas() {
    let completadas = 0;
    let pendientes = 0;
    
    lista.forEach(tarea => {
        if (tarea.completada) {
            completadas++;
        } else {
            pendientes++;
        }
    });
    
    contadorTareas.textContent = `Pendientes: ${pendientes} | Completadas: ${completadas}`;
}

// ===================================================
// Actualizar mensaje vacío y contenedor
// ===================================================

function actualizarMensajeVacio() {
    if (lista.length === 0) {   
        uiFunciones.mostrarMensajeVacio();
        contenedorLista.classList.add('d-none');
    } else {
        uiFunciones.ocultarMensajeVacio();
        contenedorLista.classList.remove('d-none');
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargar tareas desde localStorage
    cargarStorage();
    
    // Renderizar la lista con las tareas cargadas
    renderizarLista();
    
    // Actualizar el mensaje vacío al cargar
    actualizarMensajeVacio();
    
    // Actualizar el contador de tareas al cargar
    actualizarContadorTareas();
});

// ===================================================
// CREAR Y AGREGAR TAREAS
// ===================================================

// Validar los datos antes de crear una tarea
function validarDatos(titulo, categoria) {
    if (!titulo || !categoria) {
        alert('Por favor, ingresa al menos el título y selecciona una categoría');
        return false;
    }
    return true;
}

// Crear un objeto tarea nuevo
function crearTarea(titulo, descripcion, categoria) {
    return {
        titulo: titulo,
        categoria: categoria,
        descripcion: descripcion,
        completada: false
    };
}

// Agregar la tarea al array
function agregarTareaAlArray(tarea) {
    lista.push(tarea);
    guardarStorage(); // Guardar en localStorage
    console.log('Tarea agregada:', tarea);
    console.log('Lista completa:', lista);
}

// Limpiar el formulario después de agregar
function limpiarFormulario() {
    inputTareaTitulo.value = '';
    inputTareaDescripcion.value = '';
    selectTareaCategoria.value = '';
}

// Función principal para agregar una tarea completa
function agregarTarea() {
    // Obtener valores del formulario
    const titulo = inputTareaTitulo.value.trim();
    const descripcion = inputTareaDescripcion.value.trim();
    const categoria = selectTareaCategoria.value;
    
    // Validar datos
    if (!validarDatos(titulo, categoria)) {
        return;
    }
    
    // Crear objeto tarea
    const nuevaTarea = crearTarea(titulo, descripcion, categoria);
    
    // Agregar al array
    agregarTareaAlArray(nuevaTarea);
    
    // Actualizar la vista
    renderizarLista();
    
    // Limpiar formulario
    limpiarFormulario();

    // Actualizar mensaje vacío
    actualizarMensajeVacio();
    
    // Actualizar contador de tareas
    actualizarContadorTareas();
    
    // Animar la nueva tarea añadida
    setTimeout(() => {
        const nuevaTarea = document.getElementById(`tarea-${lista.length - 1}`);
        uiFunciones.animarAparicionTarea(nuevaTarea);
    }, 100);
}

// ===================================================
// RENDERIZAR Y MOSTRAR TAREAS
// ===================================================

// Obtener el color de la categoría
function obtenerColorCategoria(categoria) {
    switch(categoria) {
        case 'Importante':
            return 'bg-danger';      // Rojo
        case 'Trabajo':
            return 'bg-primary';        // Azul 
        case 'Salud':
            return 'bg-success';     // Verde claro
        case 'Hogar':
            return 'bg-purple';      // Morado
        default:
            return 'bg-secondary';   // Gris
    }
}

// Renderizar todas las tareas en la pantalla
function renderizarLista() {
    let listaHTML = '';

    // Crear HTML para cada tarea
    lista.forEach((tarea, index) => {
        const colorCategoria = obtenerColorCategoria(tarea.categoria);
        listaHTML += `
            <li id="tarea-${index}" draggable="true" class="list-group-item d-flex flex-column align-items-start position-relative ${tarea.completada ? 'completado' : ''}">
                <div>
                    <span class="fw-bold me-2 js-tituloTarea" data-index="${index}" style="cursor: pointer;">${tarea.titulo}</span>
                    <span class="badge ms-2 ${colorCategoria} text-white">${tarea.categoria}</span>
                </div>
                <div class="small text-muted mt-1">${tarea.descripcion}</div>

                <div class="dropdown position-absolute" style="top: -14px; right: 5px;">
                    <button class="btn p-0 border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 1.2rem; line-height: 1;">
                        ...
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <button class="dropdown-item text-primary js-editarTarea" data-index="${index}">
                                Editar
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item text-danger js-eliminarTarea" data-index="${index}">
                                Eliminar
                            </button>
                        </li>
                    </ul>
                </div>
            </li>   
        `;
    });
    
    // Mostrar el HTML en la página
    document.getElementById('listaTareas').innerHTML = listaHTML;
    
    // Configurar eventos de los botones eliminar
    configurarEventos();
    
    // Animar lista completa si hay tareas
    if (lista.length > 0) {
        setTimeout(() => {
            uiFunciones.animarListaCompleta();
        }, 50);
    }
}



// ===================================================
// CONFIGURAR EVENTOS DE LOS BOTONES ELIMINAR Y EDITAR
// ===================================================
function configurarEventos() {
    // Eventos para eliminar
    document.querySelectorAll('.js-eliminarTarea').forEach(boton => {
        boton.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            eliminarTarea(index);
        });
    });
    
    // Eventos para editar
    document.querySelectorAll('.js-editarTarea').forEach(boton => {
        boton.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            editarTarea(index);
        });
    });
    
    // Eventos para marcar como completada
    document.querySelectorAll('.js-tituloTarea').forEach(titulo => {
        titulo.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevenir propagación
            const index = parseInt(this.getAttribute('data-index'));
            toggleCompletarTarea(index);
        });
    });
    
    // Configurar eventos de drag and drop
    configurarDragAndDrop();
}

// ===================================================
// COMPLETAR TAREAS
// ===================================================

// Alternar el estado de completada de una tarea
function toggleCompletarTarea(index) {
    // Cambiar el estado en el array
    lista[index].completada = !lista[index].completada;
    
    guardarStorage(); // Guardar en localStorage
    
    console.log(`Tarea ${index} ${lista[index].completada ? 'completada' : 'pendiente'}:`, lista[index]);
    
    // Actualizar la vista
    renderizarLista();
    
    // Actualizar contador de tareas
    actualizarContadorTareas();
}

// ===================================================
// DRAG AND DROP
// ===================================================

let tareaArrastrada = null;

// Configurar eventos de drag and drop para todas las tareas
function configurarDragAndDrop() {
    const tareasElements = document.querySelectorAll('[id^="tarea-"]');
    
    tareasElements.forEach(tarea => {
        // Cuando empieza el arrastre
        tarea.addEventListener('dragstart', function(e) {
            tareaArrastrada = this;
            this.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        });
        
        // Cuando termina el arrastre
        tarea.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
            tareaArrastrada = null;
        });
        
        // Cuando se arrastra sobre otro elemento
        tarea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.style.borderTop = '2px solid #007bff';
        });
        
        // Cuando sale del área de otro elemento
        tarea.addEventListener('dragleave', function(e) {
            this.style.borderTop = '';
        });
        
        // Cuando se suelta sobre otro elemento
        tarea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderTop = '';
            
            if (tareaArrastrada !== this) {
                reordenarTareas(tareaArrastrada, this);
            }
        });
    });
}

// Reordenar las tareas en el array
function reordenarTareas(tareaOrigen, tareaDestino) {
    // Obtener índices de las tareas
    const indiceOrigen = parseInt(tareaOrigen.id.split('-')[1]);
    const indiceDestino = parseInt(tareaDestino.id.split('-')[1]);
    
    // Mover el elemento en el array
    const tareaMovida = lista.splice(indiceOrigen, 1)[0];
    lista.splice(indiceDestino, 0, tareaMovida);
    
    guardarStorage(); // Guardar en localStorage
    
    console.log('Tareas reordenadas:', lista);
    
    // Volver a renderizar la lista
    renderizarLista();
}

// ===================================================
// ELIMINAR TAREAS
// ===================================================

// Eliminar una tarea del array
function eliminarTareaDelArray(index) {
    if (index >= 0 && index < lista.length) {
        lista.splice(index, 1);
        guardarStorage(); // Guardar en localStorage
        console.log('Tarea eliminada. Lista actualizada:', lista);
    }
}

// Función principal para eliminar una tarea completa
function eliminarTarea(index) {
    const tareaElement = document.getElementById(`tarea-${index}`);
    
    // Animar eliminación y luego proceder
    uiFunciones.animarEliminacionTarea(tareaElement, () => {
        // Eliminar del array
        eliminarTareaDelArray(index);
        
        // Actualizar la vista
        renderizarLista();
        // Actualizar mensaje vacío
        actualizarMensajeVacio();
        
        // Actualizar contador de tareas
        actualizarContadorTareas();
        
        console.log(`Tarea en el índice ${index} eliminada.`);
    });
}


// ===================================================
// EDITAR TAREAS
// ===================================================
function editarTarea(index) {
    const tarea = lista[index];
    
    // Crear el HTML del formulario de edición
    const formularioHTML = `
        <li id="tarea-${index}" draggable="false" class="list-group-item d-flex flex-column align-items-start position-relative">
            <input type="text" class="form-control mb-2" value="${tarea.titulo}" id="editTitulo-${index}">
            <select class="form-select mb-2" id="editCategoria-${index}">
                <option value="Hogar" ${tarea.categoria === 'Hogar' ? 'selected' : ''}>Hogar</option>
                <option value="Salud" ${tarea.categoria === 'Salud' ? 'selected' : ''}>Salud</option>
                <option value="Trabajo" ${tarea.categoria === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
                <option value="Importante" ${tarea.categoria === 'Importante' ? 'selected' : ''}>Importante</option>
            </select>
            <input type="text" class="form-control mb-2" value="${tarea.descripcion}" id="editDescripcion-${index}">
            <button class="btn btn-success btn-sm js-guardarTarea" data-index="${index}">Guardar</button>
        </li>
    `;
    
    // Encontrar el li específico por su ID y reemplazarlo
    const tareaElement = document.getElementById(`tarea-${index}`);
    tareaElement.outerHTML = formularioHTML;
    
    // Configurar evento para el botón guardar
    configurarEventoGuardar();
    
    // Configurar eventos de Enter para los inputs de edición
    uiFunciones.configurarEventosEnterEdicion();
    
    console.log(`Editando tarea en el índice ${index}`);
}

// Configurar evento para el botón guardar
function configurarEventoGuardar() {
    document.querySelectorAll('.js-guardarTarea').forEach(boton => {
        boton.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            guardarTareaEditada(index);
        });
    });
}

// Guardar los cambios de la tarea editada
function guardarTareaEditada(index) {
    // Obtener los nuevos valores del formulario
    const nuevoTitulo = document.getElementById(`editTitulo-${index}`).value.trim();
    const nuevaCategoria = document.getElementById(`editCategoria-${index}`).value;
    const nuevaDescripcion = document.getElementById(`editDescripcion-${index}`).value.trim();
    
    // Validar que al menos el título esté completo
    if (!nuevoTitulo) {
        alert('El título no puede estar vacío');
        return;
    }
    
    // Actualizar el objeto en el array
    lista[index].titulo = nuevoTitulo;
    lista[index].categoria = nuevaCategoria;
    lista[index].descripcion = nuevaDescripcion;
    
    guardarStorage(); // Guardar en localStorage
    
    console.log('Tarea actualizada:', lista[index]);
    console.log('Lista completa:', lista);
    
    // Volver a renderizar la lista completa
    renderizarLista();
    
    // Actualizar contador de tareas
    actualizarContadorTareas();
}

// ===================================================
// INICIALIZACIÓN
// ===================================================

// Configurar el evento del botón agregar
botonAgregar.addEventListener('click', agregarTarea);

// Inicializar UI (filtros, tema, etc.) y obtener funciones de animación
uiFunciones = inicializarUI();

