require('dotenv').config(); // Carga variables de entorno desde .env
const express = require('express'); // Framework web de Node.js
const app = express(); // Crea instancia de Express
const path = require('path'); // Para manejo de rutas de archivos
const { logger } = require('./middleware/logEvents'); // Middleware de logging
const errorHandler = require('./middleware/errorHandler'); // Middleware de manejo de errores
const cors = require('cors'); // Middleware para CORS
const corsOptions = require('./config/corsOptions'); // Configuración de CORS
const verifyJWT = require('./middleware/verifyJWT'); // Middleware de verificación JWT
const cookieParser = require('cookie-parser'); // Parser de cookies
const credentials = require('./middleware/credentials'); // Middleware de credenciales CORS
const mongoose = require('mongoose'); // ODM para MongoDB
const connectDB = require('./config/dbConn'); // Función de conexión a MongoDB
const PORT = process.env.PORT || 3500; // Puerto del servidor

// Conecta a la base de datos MongoDB
connectDB();

// Middleware de logging personalizado
app.use(logger);

// Middleware para manejo de credenciales CORS
app.use(credentials);

// Middleware CORS con configuración personalizada
app.use(cors(corsOptions));

// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: false }));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear cookies
app.use(cookieParser());


// Sirve archivos estáticos de la carpeta styles del frontend
app.use('/styles', express.static(path.join(__dirname, '..', 'frontend', 'styles')));

// Sirve archivos estáticos de la carpeta scripts del frontend
app.use('/scripts', express.static(path.join(__dirname, '..', 'frontend', 'scripts')));

// Rutas públicas (no requieren autenticación)
app.use('/', require('./routes/root')); // Página principal
app.use('/register', require('./routes/register')); // Registro de usuarios
app.use('/auth', require('./routes/auth')); // Autenticación/login
app.use('/refresh', require('./routes/refresh')); // Renovación de tokens
app.use('/logout', require('./routes/logout')); // Cierre de sesión

app.use(verifyJWT); // Middleware JWT - Rutas siguientes requieren autenticación
app.use('/tasks', require('./routes/api/tasks')); // Rutas de tareas (CRUD) 

// Manejo de rutas no encontradas (404)
app.get(/.*/, (req, res) => {
    res.status(404); // Código de estado 404
    
    if (req.accepts('html')) { // Si acepta HTML
        res.sendFile(path.join(__dirname, 'views', '404.html')); // Envía página 404
    } else if (req.accepts('json')) { // Si acepta JSON
        res.json({ error: '404 Not Found' }); // Envía error en JSON
    } else {
        res.type('txt').send('404 Not Found'); // Envía texto plano
    }
});

app.use(errorHandler); // Middleware de manejo de errores (debe ir al final)

// Inicia el servidor solo después de conectar a MongoDB
mongoose.connection.once('open', () => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Local access: http://localhost:${PORT}`);
        console.log(`Network access: http://[YOUR_IP]:${PORT}`);
        console.log('To find your IP: run "ipconfig" in Command Prompt and look for IPv4 Address');
    }); // Inicia servidor en todas las interfaces
});