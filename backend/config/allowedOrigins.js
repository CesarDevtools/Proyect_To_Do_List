// Lista blanca de orígenes permitidos para CORS
const allowedOrigins = [
    'https://www.yoursite.com',     // Sitio web de producción
    'http://127.0.0.1:5500',        // Live Server de VS Code
    'http://localhost:3500',        // Desarrollo local
    'http://192.168.0.38:3500',     // Acceso desde red local
    'http://127.0.0.1:3500'         // Localhost alternativo
];

module.exports = allowedOrigins;