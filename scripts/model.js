// ===================================================
// MODEL.JS - MODEL (GESTIÓN DE DATOS Y LÓGICA DE NEGOCIO)
// ===================================================

// Array principal de tareas
export const lista = [];

// Clave para localStorage
const STORAGE_KEY = 'todoList_tareas';

// ===================================================
// FUNCIONES DE PERSISTENCIA
// ===================================================

// Guardar las tareas en localStorage
function guardarStorage() {
    try {
        const listasJSON = JSON.stringify(lista);
        localStorage.setItem(STORAGE_KEY, listasJSON);
        console.log('Tareas guardadas en localStorage:', lista);
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

// Cargar las tareas desde localStorage
function cargarStorage() {
    try {
        const listasJSON = localStorage.getItem(STORAGE_KEY);
        
        if (listasJSON) {
            const tareasGuardadas = JSON.parse(listasJSON);
            
            // Limpiar el array actual
            lista.length = 0;
            
            // Agregar las tareas cargadas
            tareasGuardadas.forEach(tarea => {
                lista.push(tarea);
            });
            
            console.log('Tareas cargadas desde localStorage:', lista);
        } else {
            console.log('No hay tareas guardadas en localStorage');
        }
    } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
    }
}

// ===================================================
// OPERACIONES CRUD (Create, Read, Update, Delete)
// ===================================================

// Validar los datos antes de crear una tarea
function validarDatos(titulo, categoria) {
    if (!titulo || !categoria) {
        return {
            esValido: false,
            mensaje: 'Por favor, ingresa al menos el título y selecciona una categoría'
        };
    }
    return {
        esValido: true,
        mensaje: ''
    };
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

// Agregar una tarea al array
function agregarTarea(titulo, descripcion, categoria) {
    const validacion = validarDatos(titulo, categoria);
    
    if (!validacion.esValido) {
        return {
            exito: false,
            mensaje: validacion.mensaje
        };
    }
    
    const nuevaTarea = crearTarea(titulo, descripcion, categoria);
    lista.push(nuevaTarea);
    guardarStorage();
    
    console.log('Tarea agregada:', nuevaTarea);
    console.log('Lista completa:', lista);
    
    return {
        exito: true,
        tarea: nuevaTarea,
        indice: lista.length - 1
    };
}

// Actualizar una tarea existente
function actualizarTarea(index, nuevoTitulo, nuevaCategoria, nuevaDescripcion) {
    if (index < 0 || index >= lista.length) {
        return {
            exito: false,
            mensaje: 'Índice de tarea inválido'
        };
    }
    
    if (!nuevoTitulo.trim()) {
        return {
            exito: false,
            mensaje: 'El título no puede estar vacío'
        };
    }
    
    // Actualizar el objeto en el array
    lista[index].titulo = nuevoTitulo;
    lista[index].categoria = nuevaCategoria;
    lista[index].descripcion = nuevaDescripcion;
    
    guardarStorage();
    
    console.log('Tarea actualizada:', lista[index]);
    
    return {
        exito: true,
        tarea: lista[index]
    };
}

// Eliminar una tarea del array
function eliminarTarea(index) {
    if (index >= 0 && index < lista.length) {
        const tareaEliminada = lista.splice(index, 1)[0];
        guardarStorage();
        console.log('Tarea eliminada. Lista actualizada:', lista);
        
        return {
            exito: true,
            tareaEliminada: tareaEliminada
        };
    }
    
    return {
        exito: false,
        mensaje: 'Índice de tarea inválido'
    };
}

// Alternar el estado de completada de una tarea
function toggleCompletarTarea(index) {
    if (index < 0 || index >= lista.length) {
        return {
            exito: false,
            mensaje: 'Índice de tarea inválido'
        };
    }
    
    // Cambiar el estado en el array
    lista[index].completada = !lista[index].completada;
    guardarStorage();
    
    console.log(`Tarea ${index} ${lista[index].completada ? 'completada' : 'pendiente'}:`, lista[index]);
    
    return {
        exito: true,
        tarea: lista[index]
    };
}

// Reordenar las tareas en el array
function reordenarTareas(indiceOrigen, indiceDestino) {
    if (indiceOrigen < 0 || indiceOrigen >= lista.length || 
        indiceDestino < 0 || indiceDestino >= lista.length) {
        return {
            exito: false,
            mensaje: 'Índices inválidos'
        };
    }
    
    // Mover el elemento en el array
    const tareaMovida = lista.splice(indiceOrigen, 1)[0];
    lista.splice(indiceDestino, 0, tareaMovida);
    
    guardarStorage();
    console.log('Tareas reordenadas:', lista);
    
    return {
        exito: true
    };
}

// ===================================================
// FUNCIONES DE CONSULTA Y ESTADÍSTICAS
// ===================================================

// Obtener estadísticas de las tareas
function obtenerEstadisticas() {
    let completadas = 0;
    let pendientes = 0;
    
    lista.forEach(tarea => {
        if (tarea.completada) {
            completadas++;
        } else {
            pendientes++;
        }
    });
    
    return {
        total: lista.length,
        completadas,
        pendientes
    };
}

// Obtener todas las tareas
function obtenerTodasLasTareas() {
    return [...lista]; // Retornar una copia para evitar modificaciones directas
}

// Verificar si la lista está vacía
function estaVacia() {
    return lista.length === 0;
}

// ===================================================
// EXPORTACIONES
// ===================================================

export { 
    guardarStorage, 
    cargarStorage,
    agregarTarea,
    actualizarTarea,
    eliminarTarea,
    toggleCompletarTarea,
    reordenarTareas,
    obtenerEstadisticas,
    obtenerTodasLasTareas,
    estaVacia,
    validarDatos
};