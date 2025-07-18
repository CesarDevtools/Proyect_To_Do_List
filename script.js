// ===================================================
// SCRIPT.JS - CONTROLLER (COORDINADOR ENTRE MODEL Y VIEW)
// ===================================================

// IMPORTACIONES
import { 
    lista, 
    cargarStorage,
    agregarTarea,
    actualizarTarea,
    eliminarTarea,
    toggleCompletarTarea,
    reordenarTareas,
    obtenerEstadisticas,
    estaVacia
} from "./lista.js";

import { inicializarUI } from "./ui.js";

// Variables para las funciones de UI
let uiFunciones;

// ELEMENTOS DEL DOM (solo para eventos)
const botonAgregar = document.getElementById('botonAgregar');

// ===================================================
// FUNCIONES DEL CONTROLADOR
// ===================================================

// Actualizar toda la vista
function actualizarVista() {
    const estadisticas = obtenerEstadisticas();
    const listaVacia = estaVacia();
    
    // Renderizar lista con callback para eventos
    uiFunciones.renderizarLista(lista, configurarEventos);
    
    // Actualizar contador
    uiFunciones.actualizarContadorTareas(estadisticas);
    
    // Actualizar mensaje vacío
    uiFunciones.actualizarMensajeVacio(listaVacia);
}

// ===================================================
// MANEJADORES DE EVENTOS (Event Handlers)
// ===================================================

// Agregar nueva tarea
function crearNuevaTarea() {
    // Obtener datos del formulario (a través de la vista)
    const datosFormulario = uiFunciones.obtenerDatosFormulario();
    
    // Procesar a través del modelo
    const resultado = agregarTarea(
        datosFormulario.titulo,
        datosFormulario.descripcion,
        datosFormulario.categoria
    );
    
    if (resultado.exito) {
        // Limpiar formulario
        uiFunciones.limpiarFormulario();
        
        // Actualizar vista
        actualizarVista();
        
        // Animar la nueva tarea añadida
        setTimeout(() => {
            const nuevaTarea = document.getElementById(`tarea-${resultado.indice}`);
            uiFunciones.animarAparicionTarea(nuevaTarea);
        }, 100);
    } else {
        // Mostrar error
        uiFunciones.mostrarError(resultado.mensaje);
    }
}

// Eliminar tarea
function borrarTarea(index) {
    const tareaElement = document.getElementById(`tarea-${index}`);
    
    // Animar eliminación y luego proceder
    uiFunciones.animarEliminacionTarea(tareaElement, () => {
        // Eliminar a través del modelo
        const resultado = eliminarTarea(index);
        
        if (resultado.exito) {
            // Actualizar vista
            actualizarVista();
            console.log(`Tarea en el índice ${index} eliminada.`);
        } else {
            uiFunciones.mostrarError(resultado.mensaje);
            // Restaurar vista en caso de error
            actualizarVista();
        }
    });
}

// Alternar el estado de completada de una tarea
function marcarCompletada(index) {
    const resultado = toggleCompletarTarea(index);
    
    if (resultado.exito) {
        // Actualizar vista
        actualizarVista();
    } else {
        uiFunciones.mostrarError(resultado.mensaje);
    }
}

// Editar tarea
function modificarTarea(index) {
    if (index < 0 || index >= lista.length) {
        uiFunciones.mostrarError('Tarea no encontrada');
        return;
    }
    
    const tarea = lista[index];
    
    // Mostrar formulario de edición (a través de la vista)
    uiFunciones.mostrarFormularioEdicion(index, tarea, guardarTareaEditada);
    
    console.log(`Editando tarea en el índice ${index}`);
}

// Guardar los cambios de la tarea editada
function guardarTareaEditada(index) {
    // Obtener datos del formulario de edición
    const datosEdicion = uiFunciones.obtenerDatosFormularioEdicion(index);
    
    // Actualizar a través del modelo
    const resultado = actualizarTarea(
        index,
        datosEdicion.titulo,
        datosEdicion.categoria,
        datosEdicion.descripcion
    );
    
    if (resultado.exito) {
        // Actualizar vista
        actualizarVista();
        console.log('Tarea actualizada exitosamente');
    } else {
        uiFunciones.mostrarError(resultado.mensaje);
    }
}

// Reordenar las tareas en el array
function cambiarOrdenTareas(tareaOrigen, tareaDestino) {
    // Obtener índices de las tareas
    const indiceOrigen = parseInt(tareaOrigen.id.split('-')[1]);
    const indiceDestino = parseInt(tareaDestino.id.split('-')[1]);
    
    // Reordenar a través del modelo
    const resultado = reordenarTareas(indiceOrigen, indiceDestino);
    
    if (resultado.exito) {
        // Actualizar vista
        actualizarVista();
    } else {
        uiFunciones.mostrarError(resultado.mensaje);
    }
}

// ===================================================
// CONFIGURACIÓN DE EVENTOS DEL DOM
// ===================================================

// Configurar eventos de los botones y elementos de la lista
function configurarEventos() {
    // Eventos para eliminar
    document.querySelectorAll('.js-eliminarTarea').forEach(boton => {
        boton.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            borrarTarea(index);
        });
    });
    
    // Eventos para editar
    document.querySelectorAll('.js-editarTarea').forEach(boton => {
        boton.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            modificarTarea(index);
        });
    });
    
    // Eventos para marcar como completada
    document.querySelectorAll('.js-tituloTarea').forEach(titulo => {
        titulo.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevenir propagación
            const index = parseInt(this.getAttribute('data-index'));
            marcarCompletada(index);
        });
    });
    
    // Configurar eventos de drag and drop
    configurarDragAndDrop();
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
                cambiarOrdenTareas(tareaArrastrada, this);
            }
        });
    });
}

// ===================================================
// INICIALIZACIÓN DEL CONTROLADOR
// ===================================================

// Inicializar la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar UI y obtener funciones
    uiFunciones = inicializarUI();
    
    // Cargar tareas desde localStorage
    cargarStorage();
    
    // Actualizar vista inicial
    actualizarVista();
    
    console.log('Controlador inicializado correctamente');
});

// Configurar el evento del botón agregar
botonAgregar.addEventListener('click', crearNuevaTarea);

