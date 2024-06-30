const { Router } = require('express');
const { check, query } = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controller/usuarios');
//const validarCampos = require('../middlewares/validar-campos');
//const { validarJWT } = require('../middlewares/validar-jwt');
//const { esAdminRole,tieneRole } = require('../middlewares/validar-roles');
const {validarCampos,validarJWT, esAdminRole, tieneRole} = require('../middlewares');

const router = Router();

router.get('/', [
  query('limite').optional().isInt({ gt: 0 }).withMessage('El límite debe ser un número entero mayor que 0'),
  query('desde').optional().isInt({ gt: -1 }).withMessage('Desde debe ser un número entero mayor o igual a 0'),
  validarCampos
], usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id','No es un ID valido ').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);

router.post('/', [
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('correo').custom(emailExiste),
    check('password', 'El Password es obligatorio y debe tener más de 6 letras').isLength({ min: 6 }),
    // check('rol', 'No es un Rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

module.exports = router;
