
const User = require('../model/User'); // Modelo de usuario de MongoDB
const bcrypt = require('bcrypt'); // Para encriptar contraseñas

// Controlador que maneja el registro de nuevos usuarios
const handleNewUser = async (req, res) => {
    const { name, email, pwd } = req.body; // Extrae nombre, correo electrónico y contraseña del body

    if (!name || !email || !pwd) return res.status(400).json({ 'message': 'Name, email and password are required.' }); // Valida campos requeridos

    const duplicate = await User.findOne({ email: email }).exec(); // Verifica si el correo electrónico ya existe
    if (duplicate) return res.sendStatus(409); // Conflict - correo electrónico duplicado
    
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10); // Encripta contraseña con salt de 10

        const result = await User.create({ // Crea nuevo usuario en MongoDB
            "name": name,
            "email": email,
            "password": hashedPwd
        });

        console.log(result); // Log del usuario creado

        res.status(201).json({ 'success': `New user ${name} created!` }); // Respuesta exitosa
    } catch (err) {
        res.status(500).json({ 'message': err.message }); // Maneja errores de creación
    }
}

module.exports = { handleNewUser };