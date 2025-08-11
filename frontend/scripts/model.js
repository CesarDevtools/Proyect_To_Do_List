// ===================================================
// MODEL.JS - MODEL (GESTIÓN DE DATOS Y LÓGICA DE NEGOCIO)
// ===================================================

// Importar funciones de la API
import * as API from './api.js';

// Array principal de tareas (ahora se sincroniza con el backend)
export const lista = [];

// ===================================================
// FUNCIONES DE PERSISTENCIA (AHORA CON BACKEND)
// ===================================================

// Cargar tareas desde el backend
async function cargarTareas() {
    try {
        const resultado = await API.obtenerTareas();
        
        if (resultado.exito) {
            // Limpiar array local
            lista.length = 0;
            
            // Agregar tareas del servidor
            resultado.tareas.forEach(tarea => {
                lista.push(tarea);
            });
            
            console.log('Tareas cargadas desde el servidor:', lista);
            return { exito: true };
        } else {
            console.error('Error cargando tareas:', resultado.mensaje);
            return { exito: false, mensaje: resultado.mensaje };
        }
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        return { exito: false, mensaje: error.message };
    }
}

// ===================================================
// OPERACIONES CRUD (AHORA CON BACKEND)
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

// Agregar una tarea (envía al backend)
async function agregarTarea(titulo, descripcion, categoria) {
    const validacion = validarDatos(titulo, categoria);
    
    if (!validacion.esValido) {
        return {
            exito: false,
            mensaje: validacion.mensaje
        };
    }
    
    try {
        const resultado = await API.crearTarea(titulo, descripcion, categoria);
        
        if (resultado.exito) {
            // Agregar a la lista local
            lista.push(resultado.tarea);
            
            console.log('Tarea agregada:', resultado.tarea);
            
            return {
                exito: true,
                tarea: resultado.tarea,
                indice: lista.length - 1
            };
        } else {
            return {
                exito: false,
                mensaje: resultado.mensaje
            };
        }
    } catch (error) {
        console.error('Error agregando tarea:', error);
        return {
            exito: false,
            mensaje: 'Error conectando con el servidor'
        };
    }
}

// Actualizar una tarea existente (envía al backend)
async function actualizarTarea(index, nuevoTitulo, nuevaCategoria, nuevaDescripcion) {
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
    
    try {
        const tareaActual = lista[index];
        const datosActualizacion = {
            titulo: nuevoTitulo,
            categoria: nuevaCategoria,
            descripcion: nuevaDescripcion
        };
        
        const resultado = await API.actualizarTarea(tareaActual._id, datosActualizacion);
        
        if (resultado.exito) {
            // Actualizar en la lista local
            lista[index] = resultado.tarea;
            
            console.log('Tarea actualizada:', resultado.tarea);
            
            return {
                exito: true,
                tarea: resultado.tarea
            };
        } else {
            return {
                exito: false,
                mensaje: resultado.mensaje
            };
        }
    } catch (error) {
        console.error('Error actualizando tarea:', error);
        return {
            exito: false,
            mensaje: 'Error conectando con el servidor'
        };
    }
}

// Eliminar una tarea (envía al backend)
async function eliminarTarea(index) {
    if (index < 0 || index >= lista.length) {
        return {
            exito: false,
            mensaje: 'Índice de tarea inválido'
        };
    }
    
    try {
        const tareaAEliminar = lista[index];
        const resultado = await API.eliminarTarea(tareaAEliminar._id);
        
        if (resultado.exito) {
            // Eliminar de la lista local
            const tareaEliminada = lista.splice(index, 1)[0];
            
            console.log('Tarea eliminada:', tareaEliminada);
            
            return {
                exito: true,
                tareaEliminada: tareaEliminada
            };
        } else {
            return {
                exito: false,
                mensaje: resultado.mensaje
            };
        }
    } catch (error) {
        console.error('Error eliminando tarea:', error);
        return {
            exito: false,
            mensaje: 'Error conectando con el servidor'
        };
    }
}

// Alternar el estado de completada de una tarea (envía al backend)
async function toggleCompletarTarea(index) {
    if (index < 0 || index >= lista.length) {
        return {
            exito: false,
            mensaje: 'Índice de tarea inválido'
        };
    }
    
    try {
        const tareaActual = lista[index];
        const nuevoEstado = !tareaActual.completada;
        
        const resultado = await API.actualizarTarea(tareaActual._id, { 
            completada: nuevoEstado 
        });
        
        if (resultado.exito) {
            // Actualizar en la lista local
            lista[index] = resultado.tarea;
            
            console.log(`Tarea ${index} ${nuevoEstado ? 'completada' : 'pendiente'}:`, resultado.tarea);
            
            return {
                exito: true,
                tarea: resultado.tarea
            };
        } else {
            return {
                exito: false,
                mensaje: resultado.mensaje
            };
        }
    } catch (error) {
        console.error('Error actualizando estado de tarea:', error);
        return {
            exito: false,
            mensaje: 'Error conectando con el servidor'
        };
    }
}

// Reordenar las tareas (envía al backend)
async function reordenarTareas(indiceOrigen, indiceDestino) {
    if (indiceOrigen < 0 || indiceOrigen >= lista.length || 
        indiceDestino < 0 || indiceDestino >= lista.length) {
        return {
            exito: false,
            mensaje: 'Índices inválidos'
        };
    }
    
    try {
        const tareaMovida = lista[indiceOrigen];
        
        const resultado = await API.reordenarTareas(
            tareaMovida._id, 
            indiceOrigen, 
            indiceDestino
        );
        
        if (resultado.exito) {
            // Actualizar lista local con el nuevo orden del servidor
            lista.length = 0;
            resultado.tareas.forEach(tarea => {
                lista.push(tarea);
            });
            
            console.log('Tareas reordenadas:', lista);
            
            return {
                exito: true
            };
        } else {
            return {
                exito: false,
                mensaje: resultado.mensaje
            };
        }
    } catch (error) {
        console.error('Error reordenando tareas:', error);
        return {
            exito: false,
            mensaje: 'Error conectando con el servidor'
        };
    }
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
    cargarTareas,
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