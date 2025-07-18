// ===================================================
// LISTA.JS - GESTIÓN DE DATOS Y PERSISTENCIA
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
// EXPORTACIONES
// ===================================================

export { guardarStorage, cargarStorage };