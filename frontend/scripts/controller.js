// ===================================================
// CONTROLLER.JS - CONTROLLER (COORDINADOR ENTRE MODEL Y VIEW)
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
} from "./model.js";

import { inicializarUI } from "./view.js";

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
// FUNCIONES DE AUTENTICACIÓN
// ===================================================

// Función para manejar logout
async function handleLogout() {
    try {
        // Obtener datos del usuario antes de limpiar
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Mostrar confirmación
        const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?');
        if (!confirmLogout) return;

        // Realizar petición de logout al servidor
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include' // Incluir cookies para el refresh token
        });

        // Mostrar mensaje de despedida
        alert(`¡Hasta luego${user.name ? ', ' + user.name : ''}! Sesión cerrada exitosamente.`);
        
        // Limpiar datos locales
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Redirigir al login
        window.location.href = '/login';
        
    } catch (error) {
        console.error('Error durante logout:', error);
        
        // Obtener datos del usuario antes de limpiar
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Aunque haya error, limpiar datos locales
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        alert(`¡Hasta luego${user.name ? ', ' + user.name : ''}! Sesión cerrada localmente.`);
        window.location.href = '/login';
    }
}

// Verificar si el usuario está autenticado
function verificarAutenticacion() {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        // Si no hay token o usuario, redirigir al login
        window.location.href = '/login';
        return false;
    }
    
    // Opcional: Mostrar nombre del usuario en la UI
    try {
        const userData = JSON.parse(user);
        console.log(`Usuario autenticado: ${userData.name} (${userData.email})`);
    } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
    }
    
    return true;
}

// ===================================================
// INICIALIZACIÓN DEL CONTROLADOR
// ===================================================

// Inicializar la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación antes de inicializar la app
    if (!verificarAutenticacion()) {
        return; // Si no está autenticado, ya se redirigió
    }
    
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

// Configurar el evento del botón logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

