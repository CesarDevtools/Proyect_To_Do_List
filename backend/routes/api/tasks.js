const express = require('express'); // Framework web de Node.js
const router = express.Router(); // Crea router de Express
const taskController = require('../../controllers/taskController'); // Controlador de tareas

// Rutas CRUD para endpoint base /tasks
router.route('/')
    .get(taskController.getAllTasks)    // GET - Obtiene todas las tareas del usuario
    .post(taskController.createNewTask) // POST - Crea nueva tarea
    .put(taskController.updateTask)     // PUT - Actualiza tarea existente
    .delete(taskController.deleteTask); // DELETE - Elimina tarea

// Ruta específica para reordenar tareas (drag & drop)
router.route('/reorder')
    .put(taskController.reorderTasks);  // PUT - Reordena múltiples tareas

// Exporta router con prefijo /tasks
module.exports = router;