const User = require('../model/User'); // Modelo de usuario de MongoDB

// Controlador que maneja el proceso de logout/cierre de sesión
const handleLogout = async (req, res) => {
    // NOTA: En el cliente también se debe eliminar el accessToken
    const cookies = req.cookies; // Obtiene cookies de la petición
    
    if (!cookies?.jwt) return res.sendStatus(204); // No hay refresh token, logout exitoso
    const refreshToken = cookies.jwt; // Extrae refresh token de cookies

    // Busca usuario por refresh token (compatible con estructura name/email)
    const foundUser = await User.findOne({ refreshToken }).exec() 
    if (!foundUser) { // Usuario no encontrado o token inválido
        res.clearCookie('jwt', { 
            httpOnly: true,
            sameSite: 'None', 
            secure: true 
        }); // Limpia cookie con configuración segura
        return res.sendStatus(204); // No Content - logout exitoso
    }

    // Elimina refresh token del usuario (independiente de estructura email/username)
    foundUser.refreshToken = ''; 
    const result = await foundUser.save(); // Guarda cambios en MongoDB
    console.log(`User ${foundUser.email} (${foundUser.name}) logged out successfully`); // Log mejorado
   
    res.clearCookie('jwt', { 
        httpOnly: true,
        sameSite: 'None', 
        secure: true 
    }); // Elimina cookie del navegador con configuración segura
    return res.sendStatus(204); // No Content - logout exitoso
}

module.exports = { handleLogout };