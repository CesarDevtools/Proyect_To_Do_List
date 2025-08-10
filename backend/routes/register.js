const express = require('express'); // Framework web de Node.js
const router = express.Router(); // Crea router de Express
const registerController = require('../controllers/registerController'); // Controlador de registro

// Ruta POST /register - Maneja el registro de nuevos usuarios
router.post('/', registerController.handleNewUser); // Procesa datos y crea usuario


module.exports = router;// Exporta el router para usarlo en otros archivos