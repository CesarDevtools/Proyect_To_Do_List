// ===================================================
// API.JS - COMUNICACIÓN CON EL BACKEND
// ===================================================

// URL base del backend
const API_BASE_URL = 'http://localhost:3500';

// ===================================================
// FUNCIONES DE UTILIDAD
// ===================================================

// Obtener token JWT del localStorage
function getAuthToken() {
    return localStorage.getItem('accessToken');
}

// Crear headers estándar para las requests
function createHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// Manejar errores de respuesta
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || `Error ${response.status}`);
    }
    return await response.json();
}

// ===================================================
// API DE TAREAS (CRUD)
// ===================================================

// Obtener todas las tareas del usuario
export async function obtenerTareas() {
    try {
        const headers = createHeaders();
        console.log('Headers enviados:', headers); // ← Debug
        console.log('Token disponible:', getAuthToken()); // ← Debug
        
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'GET',
            headers: headers
        });
        
        const tareas = await handleResponse(response);
        console.log('Tareas obtenidas del servidor:', tareas);
        return {
            exito: true,
            tareas: tareas
        };
    } catch (error) {
        console.error('Error obteniendo tareas:', error);
        return {
            exito: false,
            mensaje: error.message
        };
    }
}

// Crear nueva tarea
export async function crearTarea(titulo, descripcion, categoria) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify({
                titulo: titulo,
                descripcion: descripcion,
                categoria: categoria
            })
        });
        
        const nuevaTarea = await handleResponse(response);
        console.log('Tarea creada en el servidor:', nuevaTarea);
        return {
            exito: true,
            tarea: nuevaTarea
        };
    } catch (error) {
        console.error('Error creando tarea:', error);
        return {
            exito: false,
            mensaje: error.message
        };
    }
}

// Actualizar tarea existente
export async function actualizarTarea(id, datos) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify({
                id: id,
                ...datos
            })
        });
        
        const tareaActualizada = await handleResponse(response);
        console.log('Tarea actualizada en el servidor:', tareaActualizada);
        return {
            exito: true,
            tarea: tareaActualizada
        };
    } catch (error) {
        console.error('Error actualizando tarea:', error);
        return {
            exito: false,
            mensaje: error.message
        };
    }
}

// Eliminar tarea
export async function eliminarTarea(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'DELETE',
            headers: createHeaders(),
            body: JSON.stringify({
                id: id
            })
        });
        
        const resultado = await handleResponse(response);
        console.log('Tarea eliminada del servidor:', resultado);
        return {
            exito: true,
            resultado: resultado
        };
    } catch (error) {
        console.error('Error eliminando tarea:', error);
        return {
            exito: false,
            mensaje: error.message
        };
    }
}

// Reordenar tareas (drag & drop)
export async function reordenarTareas(taskId, oldPosition, newPosition) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/reorder`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify({
                taskId: taskId,
                oldPosition: oldPosition,
                newPosition: newPosition
            })
        });
        
        const resultado = await handleResponse(response);
        console.log('Tareas reordenadas en el servidor:', resultado);
        return {
            exito: true,
            tareas: resultado.tasks
        };
    } catch (error) {
        console.error('Error reordenando tareas:', error);
        return {
            exito: false,
            mensaje: error.message
        };
    }
}

// ===================================================
// FUNCIONES DE VERIFICACIÓN
// ===================================================

// Verificar si el usuario está autenticado
export function estaAutenticado() {
    const token = getAuthToken();
    return token !== null && token !== undefined && token !== '';
}

// Redirigir al login si no está autenticado
export function verificarAutenticacion() {
    if (!estaAutenticado()) {
        window.location.href = '/login';
        return false;
    }
    return true;
}
