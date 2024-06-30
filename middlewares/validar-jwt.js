const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({
            msg: 'No existe Token en la petición'
        });
    }

    try {
        // Función que verifica la validez del token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);
        //verifico si el usuario no existe esta borrado.
        if(!usuario){
          return res.status(401).json({
            msg: 'El token no es valido - usuario borrado de la DB'
          })
        }

        // Verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }

        req.usuario = usuario;
        req.uid = uid;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT
}