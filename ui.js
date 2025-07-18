// ===================================================
// UI.JS - FUNCIONES DE INTERFAZ DE USUARIO
// ===================================================

// ELEMENTOS DEL DOM PARA UI
const botonFiltrar = document.getElementById('botonFiltrar');
const filtrosOpciones = document.getElementById('filtrosOpciones');
const filtroTodas = document.getElementById('filtroTodas');
const filtroCompletadas = document.getElementById('filtroCompletadas');
const filtroPendientes = document.getElementById('filtroPendientes');
const themeLight = document.getElementById('themeLight');
const themeDark = document.getElementById('themeDark');

// ===================================================
// FUNCIONES DE FILTRADO
// ===================================================

// Aplicar filtros a las tareas mostradas
function aplicarFiltro(tipoFiltro) {
    const tareasElements = document.querySelectorAll('#listaTareas li');
    
    tareasElements.forEach(li => {
        switch(tipoFiltro) {
            case 'todas':
                li.classList.remove('d-none');
                break;
            case 'completadas':
                if (li.classList.contains('completado')) {
                    li.classList.remove('d-none');
                } else {
                    li.classList.add('d-none');
                }
                break;
            case 'pendientes':
                if (li.classList.contains('completado')) {
                    li.classList.add('d-none');
                } else {
                    li.classList.remove('d-none');
                }
                break;
        }
    });
}

// Mostrar/ocultar menú de filtros
function toggleMenuFiltros() {
    filtrosOpciones.classList.toggle('d-none');
}

// Ocultar menú de filtros
function ocultarMenuFiltros() {
    filtrosOpciones.classList.add('d-none');
}

// Configurar eventos de filtros
function configurarEventosFiltros() {
    // Mostrar/ocultar menú de filtros
    botonFiltrar.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenuFiltros();
    });

    // Ocultar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!botonFiltrar.contains(e.target) && !filtrosOpciones.contains(e.target)) {
            ocultarMenuFiltros();
        }
    });

    // Filtros específicos
    filtroTodas.addEventListener('click', () => {
        aplicarFiltro('todas');
        ocultarMenuFiltros();
    });

    filtroCompletadas.addEventListener('click', () => {
        aplicarFiltro('completadas');
        ocultarMenuFiltros();
    });

    filtroPendientes.addEventListener('click', () => {
        aplicarFiltro('pendientes');
        ocultarMenuFiltros();
    });
}

// ===================================================
// FUNCIONES DE TECLADO
// ===================================================

// Configurar eventos de Enter para el formulario principal
function configurarEventosEnter() {
    const inputTitulo = document.getElementById('tareaTitulo');
    const inputDescripcion = document.getElementById('tareaDescripcion');
    const botonAgregar = document.getElementById('botonAgregar');
    
    // Función para manejar Enter en los inputs principales
    function manejarEnterFormulario(evento) {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            if (botonAgregar) {
                botonAgregar.click();
            }
        }
    }
    
    // Agregar event listeners a los inputs
    if (inputTitulo) {
        inputTitulo.addEventListener('keydown', manejarEnterFormulario);
    }
    
    if (inputDescripcion) {
        inputDescripcion.addEventListener('keydown', manejarEnterFormulario);
    }
}

// Configurar eventos de Enter para formularios de edición
function configurarEventosEnterEdicion() {
    // Función para manejar Enter en los inputs de edición
    function manejarEnterEdicion(evento) {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            
            // Buscar el botón guardar más cercano
            const botonGuardar = evento.target.closest('li').querySelector('.js-guardarTarea');
            if (botonGuardar) {
                botonGuardar.click();
            }
        }
    }
    
    // Agregar event listeners a todos los inputs de edición
    document.querySelectorAll('[id^="editTitulo-"], [id^="editDescripcion-"]').forEach(input => {
        input.addEventListener('keydown', manejarEnterEdicion);
    });
}

// ===================================================
// ANIMACIONES Y EFECTOS
// ===================================================

// Animar aparición de una tarea nueva
function animarAparicionTarea(elemento) {
    if (elemento) {
        elemento.classList.add('fade-in');
        
        // Remover la clase después de la animación
        setTimeout(() => {
            elemento.classList.remove('fade-in');
        }, 400);
    }
}

// Animar eliminación de una tarea
function animarEliminacionTarea(elemento, callback) {
    if (elemento) {
        elemento.classList.add('eliminando');
        
        // Ejecutar callback después de la animación
        setTimeout(() => {
            if (callback) callback();
        }, 300);
    }
}

// Animar mensaje vacío elegante
function mostrarMensajeVacio() {
    const mensajeVacio = document.getElementById('mensajeVacio');
    if (mensajeVacio) {
        mensajeVacio.classList.add('mostrar');
    }
}

// Ocultar mensaje vacío elegante
function ocultarMensajeVacio() {
    const mensajeVacio = document.getElementById('mensajeVacio');
    if (mensajeVacio) {
        mensajeVacio.classList.remove('mostrar');
    }
}

// Aplicar animación de aparición a todas las tareas visibles
function animarListaCompleta() {
    const tareas = document.querySelectorAll('#listaTareas li:not(.d-none)');
    
    tareas.forEach((tarea, index) => {
        // Delay escalonado para efecto cascada
        setTimeout(() => {
            animarAparicionTarea(tarea);
        }, index * 50); // 50ms de diferencia entre cada tarea
    });
}

// ===================================================
// TEMA OSCURO/CLARO
// ===================================================

// Aplicar tema claro
function aplicarTemaClaro() {
    document.body.classList.remove('bg-dark', 'text-light');
    document.body.classList.add('bg-white', 'text-dark');
    localStorage.setItem('tema', 'claro');
    console.log('Tema cambiado a: claro');
}

// Aplicar tema oscuro
function aplicarTemaOscuro() {
    document.body.classList.remove('bg-white', 'text-dark');
    document.body.classList.add('bg-dark', 'text-light');
    localStorage.setItem('tema', 'oscuro');
    console.log('Tema cambiado a: oscuro');
}

// Cargar tema guardado
function cargarTema() {
    const temaGuardado = localStorage.getItem('tema');
    
    if (temaGuardado === 'oscuro') {
        aplicarTemaOscuro();
    } else {
        // Por defecto tema claro
        aplicarTemaClaro();
    }
}

// Configurar eventos del tema
function configurarEventosTema() {
    // Tema claro
    if (themeLight) {
        themeLight.addEventListener('click', function(e) {
            e.preventDefault();
            aplicarTemaClaro();
        });
    }
    
    // Tema oscuro
    if (themeDark) {
        themeDark.addEventListener('click', function(e) {
            e.preventDefault();
            aplicarTemaOscuro();
        });
    }
}

// ===================================================
// INICIALIZACIÓN DE UI
// ===================================================

// Función principal para inicializar todas las funcionalidades de UI
function inicializarUI() {
    // Cargar tema guardado
    cargarTema();
    
    // Configurar eventos de filtros
    configurarEventosFiltros();
    
    // Configurar eventos de tema
    configurarEventosTema();
    
    // Configurar eventos de Enter
    configurarEventosEnter();
    
    console.log('UI inicializada correctamente');
    
    // Retornar objeto con funciones de animación y UI
    return {
        // Funciones de animación
        animarAparicionTarea,
        animarEliminacionTarea,
        mostrarMensajeVacio,
        ocultarMensajeVacio,
        animarListaCompleta,
        
        // Funciones de UI adicionales
        aplicarFiltro,
        toggleMenuFiltros,
        ocultarMenuFiltros,
        aplicarTemaClaro,
        aplicarTemaOscuro,
        
        // Funciones de teclado
        configurarEventosEnterEdicion
    };
}

// Exportar funciones que podrían necesitarse desde script.js
export {
    aplicarFiltro,
    toggleMenuFiltros,
    ocultarMenuFiltros,
    aplicarTemaClaro,
    aplicarTemaOscuro,
    animarAparicionTarea,
    animarEliminacionTarea,
    mostrarMensajeVacio,
    ocultarMensajeVacio,
    animarListaCompleta,
    configurarEventosEnterEdicion,
    inicializarUI
};
