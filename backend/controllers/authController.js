const User = require('../model/User'); // Modelo de usuario de MongoDB
const bcrypt = require('bcrypt'); // Para comparar contraseñas encriptadas
const jwt = require('jsonwebtoken'); // Para generar tokens JWT

// Controlador que maneja el proceso de login/autenticación
const handleLogin = async (req, res) => {
    const { email, pwd } = req.body; // Extrae email y password del body
    
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' }); // Valida campos requeridos

    const foundUser = await User.findOne({ email: email }).exec() // Busca usuario por email en MongoDB
    if (!foundUser) return res.sendStatus(401); // Usuario no encontrado
    
    const match = await bcrypt.compare(pwd, foundUser.password); // Compara contraseña con hash
    if (match) {
        // Usa roles por defecto si no existen en el usuario
        const roles = foundUser.roles ? Object.values(foundUser.roles) : [2001]; // Role por defecto: User

        const accessToken = jwt.sign( // Genera token de acceso
            { 
                "UserInfo": {
                    "email": foundUser.email,
                    "name": foundUser.name,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET, // Usa clave secreta del .env
            { expiresIn: '1h' } // Token expira en 1 hora
        );
        const refreshToken = jwt.sign( // Genera token de renovación
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } // Refresh token expira en 1 día
        );
        
        foundUser.refreshToken = refreshToken; // Guarda refresh token en usuario
        const result = await foundUser.save(); // Actualiza usuario en MongoDB
        console.log(result); // Log del resultado

        res.cookie('jwt', refreshToken, { // Envía refresh token como cookie httpOnly
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // Cookie expira en 24 horas
        });
        res.status(200).json({ 
            accessToken,
            user: {
                name: foundUser.name,
                email: foundUser.email
            }
        }); // Envía access token y datos del usuario
    } else {
        res.sendStatus(401); // Contraseña incorrecta
    }
}

module.exports = { handleLogin };