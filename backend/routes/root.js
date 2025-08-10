const express = require('express'); // Framework web de Node.js
const path = require('path'); // Para manejo de rutas de archivos
const router = express.Router(); // Crea router de Express

// Ruta raíz - redirige al login
router.get(/^\/$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'login.html')); // Sirve archivo login.html
});

// Ruta para la página de login
router.get(/^\/login(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'login.html')); // Sirve archivo login.html
});

// Ruta para la aplicación principal (después del login)
router.get(/^\/app(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'index.html')); // Sirve archivo index.html
});

module.exports = router;