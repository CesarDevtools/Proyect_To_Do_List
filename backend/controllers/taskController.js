const Task = require('../model/Task'); // Importa el modelo de tarea



// Controlador que crea un nuevo empleado
const createNewTask = async (req, res) => {
    if (!req?.body?.titulo || !req?.body?.categoria) { // Valida campos requeridos
        return res.status(400).json({ 'message': 'Title and category are required.' });
    }

    try {
        const result = await Task.create({ // Crea nueva tarea en MongoDB
            titulo: req.body.titulo,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion || '', // Valor por defecto si no se envía
            userId: req.user.email // ← Corregido: usar req.user.email del JWT middleware
        });
        
        console.log('Tarea creada completa:', result); // Para debug
        res.status(201).json(result); // Devuelve tarea creada con TODOS los campos

    } catch (err) {
        console.error(err); // Log de errores
        res.status(500).json({ 'message': 'Error creating task.' });
    }
}

// Controlador que actualiza una tarea existente
const updateTask = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Task ID is required.' });
    }

    try {
        const task = await Task.findOne({ 
            _id: req.body.id, 
            userId: req.user.email 
        }).exec();

        if (!task) {
            return res.status(404).json({ 
                "message": `No task matches ID ${req.body.id} for this user` 
            });
        }

        // Actualizar campos si se envían
        if (req.body?.titulo) task.titulo = req.body.titulo;
        if (req.body?.categoria) task.categoria = req.body.categoria;
        if (req.body?.descripcion !== undefined) task.descripcion = req.body.descripcion;
        if (req.body?.completada !== undefined) task.completada = req.body.completada;
        if (req.body?.posicion !== undefined) task.posicion = req.body.posicion;

        const result = await task.save();
        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Error updating task.' });
    }
}

// Controlador específico para reordenar tareas (drag and drop)
const reorderTasks = async (req, res) => {
    if (!req?.body?.taskId || req?.body?.newPosition === undefined) {
        return res.status(400).json({ 
            'message': 'Task ID and new position are required.' 
        });
    }

    try {
        const { taskId, newPosition, oldPosition } = req.body;
        const userId = req.user.email;

        // 1. Actualizar la tarea que se movió
        await Task.findOneAndUpdate(
            { _id: taskId, userId: userId },
            { posicion: newPosition }
        );

        // 2. Actualizar las posiciones de las demás tareas
        if (oldPosition < newPosition) {
            // Movimiento hacia abajo: decrementar posición de tareas intermedias
            await Task.updateMany(
                { 
                    userId: userId,
                    posicion: { $gt: oldPosition, $lte: newPosition },
                    _id: { $ne: taskId }
                },
                { $inc: { posicion: -1 } }
            );
        } else {
            // Movimiento hacia arriba: incrementar posición de tareas intermedias
            await Task.updateMany(
                { 
                    userId: userId,
                    posicion: { $gte: newPosition, $lt: oldPosition },
                    _id: { $ne: taskId }
                },
                { $inc: { posicion: 1 } }
            );
        }

        // 3. Obtener todas las tareas actualizadas y ordenadas
        const updatedTasks = await Task.find({ userId: userId })
            .sort({ posicion: 1 })
            .exec();

        res.json({ 
            message: 'Tasks reordered successfully',
            tasks: updatedTasks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Error reordering tasks.' });
    }
}

// Controlador que obtiene todas las tareas del usuario
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.email })
            .sort({ posicion: 1 }) // Ordenar por posición para drag & drop
            .exec();
            
        if (!tasks || tasks.length === 0) {
            return res.status(200).json([]); // Devolver array vacío en lugar de 204
        }
        
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Error fetching tasks.' });
    }
}

// Controlador que elimina una tarea
const deleteTask = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Task ID is required.' });
    }
    
    try {
        const task = await Task.findOne({ 
            _id: req.body.id, 
            userId: req.user.email 
        }).exec();
        
        if (!task) {
            return res.status(404).json({ 
                "message": `No task matches ID ${req.body.id} for this user` 
            });
        }
        
        const result = await Task.deleteOne({ 
            _id: req.body.id, 
            userId: req.user.email 
        });
        
        res.json({ 
            message: 'Task deleted successfully',
            deletedTask: task 
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Error deleting task.' });
    }
}

// Exporta funciones del controlador
module.exports = {
    getAllTasks,
    createNewTask,
    updateTask,
    reorderTasks,
    deleteTask
}