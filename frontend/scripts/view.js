// ===================================================
// VIEW.JS - VIEW (INTERFAZ DE USUARIO Y PRESENTACIÓN)
// ===================================================

// ELEMENTOS DEL DOM PARA UI
const botonFiltrar = document.getElementById('botonFiltrar');
const filtrosOpciones = document.getElementById('filtrosOpciones');
const filtroTodas = document.getElementById('filtroTodas');
const filtroCompletadas = document.getElementById('filtroCompletadas');
const filtroPendientes = document.getElementById('filtroPendientes');
const themeToggle = document.getElementById('themeToggle');
const mensajeVacio = document.getElementById('mensajeVacio');
const contadorTareas = document.getElementById('contadorTareas');
const contenedorLista = document.getElementById('listaTareas'); // ← Corregido: usar el ID correcto

// ===================================================
// FUNCIONES DE RENDERIZADO DEL DOM
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
function renderizarLista(lista, configurarEventosCallback) {
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
    
    // Configurar eventos de los botones (callback al controlador)
    if (configurarEventosCallback) {
        configurarEventosCallback();
    }
    
    // Animar lista completa si hay tareas
    if (lista.length > 0) {
        setTimeout(() => {
            animarListaCompleta();
        }, 50);
    }
}

// Actualizar el contador de tareas en la UI
function actualizarContadorTareas(estadisticas) {
    contadorTareas.textContent = `Pendientes: ${estadisticas.pendientes} | Completadas: ${estadisticas.completadas}`;
}

// Actualizar mensaje vacío y contenedor
function actualizarMensajeVacio(estaVacia) {
    if (estaVacia) {   
        mostrarMensajeVacio();
        contenedorLista.classList.add('d-none');
    } else {
        ocultarMensajeVacio();
        contenedorLista.classList.remove('d-none');
    }
}

// Obtener valores del formulario
function obtenerDatosFormulario() {
    const inputTareaTitulo = document.getElementById('tareaTitulo');
    const inputTareaDescripcion = document.getElementById('tareaDescripcion');
    const selectTareaCategoria = document.getElementById('tareaCategoria');
    
    return {
        titulo: inputTareaTitulo.value.trim(),
        descripcion: inputTareaDescripcion.value.trim(),
        categoria: selectTareaCategoria.value
    };
}

// Limpiar el formulario
function limpiarFormulario() {
    const inputTareaTitulo = document.getElementById('tareaTitulo');
    const inputTareaDescripcion = document.getElementById('tareaDescripcion');
    const selectTareaCategoria = document.getElementById('tareaCategoria');
    
    inputTareaTitulo.value = '';
    inputTareaDescripcion.value = '';
    selectTareaCategoria.value = '';
}

// Mostrar formulario de edición
function mostrarFormularioEdicion(index, tarea, guardarCallback) {
    const formularioHTML = `
        <li id="tarea-${index}" draggable="false" class="list-group-item d-flex flex-column align-items-start position-relative">
            <input type="text" class="input mb-2" value="${tarea.titulo}" id="editTitulo-${index}">
            <select class="input mb-2" id="editCategoria-${index}">
                <option value="Hogar" ${tarea.categoria === 'Hogar' ? 'selected' : ''}>Hogar</option>
                <option value="Salud" ${tarea.categoria === 'Salud' ? 'selected' : ''}>Salud</option>
                <option value="Trabajo" ${tarea.categoria === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
                <option value="Importante" ${tarea.categoria === 'Importante' ? 'selected' : ''}>Importante</option>
            </select>
            <input type="text" class="input mb-2" value="${tarea.descripcion}" id="editDescripcion-${index}">
            <button class="btn btn-success btn-sm js-guardarTarea" data-index="${index}">Guardar</button>
        </li>
    `;
    
    // Encontrar el li específico por su ID y reemplazarlo
    const tareaElement = document.getElementById(`tarea-${index}`);
    tareaElement.outerHTML = formularioHTML;
    
    // Configurar evento para el botón guardar
    document.querySelectorAll('.js-guardarTarea').forEach(boton => {
        boton.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            guardarCallback(index);
        });
    });
    
    // Configurar eventos de Enter para los inputs de edición
    configurarEventosEnterEdicion();
    
    console.log(`Mostrando formulario de edición para tarea ${index}`);
}

// Obtener datos del formulario de edición
function obtenerDatosFormularioEdicion(index) {
    const nuevoTitulo = document.getElementById(`editTitulo-${index}`).value.trim();
    const nuevaCategoria = document.getElementById(`editCategoria-${index}`).value;
    const nuevaDescripcion = document.getElementById(`editDescripcion-${index}`).value.trim();
    
    return {
        titulo: nuevoTitulo,
        categoria: nuevaCategoria,
        descripcion: nuevaDescripcion
    };
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    alert(mensaje);
}

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

// Mostrar/ocultar menú de filtros con animación suave
function toggleMenuFiltros() {
    if (filtrosOpciones.classList.contains('mostrar')) {
        // Ocultar con animación
        filtrosOpciones.classList.remove('mostrar');
    } else {
        // Mostrar con animación
        filtrosOpciones.classList.add('mostrar');
    }
}

// Ocultar menú de filtros con animación
function ocultarMenuFiltros() {
    filtrosOpciones.classList.remove('mostrar');
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
    
    // Actualizar el switch (checked = claro = sol)
    if (themeToggle) {
        themeToggle.checked = true;
    }
    
    console.log('Tema cambiado a: claro');
}

// Aplicar tema oscuro
function aplicarTemaOscuro() {
    document.body.classList.remove('bg-white', 'text-dark');
    document.body.classList.add('bg-dark', 'text-light');
    localStorage.setItem('tema', 'oscuro');
    
    // Actualizar el switch (unchecked = oscuro = luna)
    if (themeToggle) {
        themeToggle.checked = false;
    }
    
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
    // Theme toggle switch
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                // Switch activado = tema claro (sol)
                aplicarTemaClaro();
            } else {
                // Switch desactivado = tema oscuro (luna)
                aplicarTemaOscuro();
            }
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
        // Funciones de renderizado
        renderizarLista,
        actualizarContadorTareas,
        actualizarMensajeVacio,
        obtenerDatosFormulario,
        limpiarFormulario,
        mostrarFormularioEdicion,
        obtenerDatosFormularioEdicion,
        mostrarError,
        
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
    renderizarLista,
    actualizarContadorTareas,
    actualizarMensajeVacio,
    obtenerDatosFormulario,
    limpiarFormulario,
    mostrarFormularioEdicion,
    obtenerDatosFormularioEdicion,
    mostrarError,
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
