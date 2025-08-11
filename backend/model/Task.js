const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema para las tareas
const taskSchema = new Schema({
    // Campo título (requerido)
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [100, 'El título no puede exceder 100 caracteres']
    },
    
    // Campo categoría (requerido)
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: {
            values: ['Hogar', 'Salud', 'Trabajo', 'Importante'],
            message: 'La categoría debe ser: Hogar, Salud, Trabajo o Importante'
        }
    },
    
    // Campo descripción (opcional)
    descripcion: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
        default: ''
    },
    
    // Campo completada (boolean)
    completada: {
        type: Boolean,
        default: false
    },
    
    // Referencia al usuario propietario (usando email)
    userId: {
        type: String,
        required: [true, 'El email del usuario es obligatorio']
    },
    
    // Campo para ordenamiento personalizado
    posicion: {
        type: Number,
        default: 0
    }
}, {
    // Timestamps automáticos (createdAt y updatedAt)
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
