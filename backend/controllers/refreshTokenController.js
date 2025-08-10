const User = require('../model/User'); // Modelo de usuario de MongoDB
const jwt = require('jsonwebtoken'); // Para verificar y generar tokens JWT

// Controlador que maneja la renovación de access tokens usando refresh tokens
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies; // Obtiene cookies de la petición
    
    if (!cookies?.jwt) return res.sendStatus(401); // No hay refresh token en cookies
    console.log(cookies.jwt); // Log del refresh token

    const refreshToken = cookies.jwt; // Extrae refresh token de cookies
    const foundUser = await User.findOne({ refreshToken }).exec() // Busca usuario por refresh token
    if (!foundUser) return res.sendStatus(403); // Refresh token no válido

    jwt.verify( // Verifica la validez del refresh token
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET, // Usa clave secreta del .env
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) { // Token inválido o email no coincide
                return res.sendStatus(403);
            }
            // Usa roles por defecto si no existen en el usuario
            const roles = foundUser.roles ? Object.values(foundUser.roles) : [2001]; // Role por defecto: User
            const accessToken = jwt.sign( // Genera nuevo access token
                { "UserInfo": 
                    { 
                        "email": foundUser.email,
                        "name": foundUser.name,
                        "roles": roles 
                    } 
                },
                process.env.ACCESS_TOKEN_SECRET, // Usa clave secreta del access token
                { expiresIn: '15m' } // Nuevo token expira en 15 minutos (consistente con authController)
            );
            res.status(200).json({ 
                accessToken,
                user: {
                    name: foundUser.name,
                    email: foundUser.email
                }
            }); // Envía nuevo access token y datos del usuario
        }
    );
}

module.exports = { handleRefreshToken };