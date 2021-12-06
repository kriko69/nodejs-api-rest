//rutas acerca del usuario

const {Router} = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosGetTodos } = require('../controllers/users');
const {check} = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRol, tieneRol } = require('../middlewares/validar-rol');

const { esRolValido, correoExiste, existeUsuario } = require('../helpers/db-validators');

//constante necesario para la creacion de las rutas
const router = Router();

router.get('/', usuariosGetTodos);
router.get('/:id',[
    check('id','No es un ID valido').isMongoId(), //valido si es un ID valido para mongo NECESARIO
    check('id').custom(async (id)=>{
        await existeUsuario(id);
    }),
    validarCampos
], usuariosGet);

router.post('/',[
    //valido el campo "nombre" que pasan en la request
    check('nombre','El nombre no es valido').not().isEmpty(), //si no es vacio
    check('correo','El correo no es valido').isEmail().custom(async (correo)=>{
        await correoExiste(correo); //llamo a la funcion personalizada de /helpers/db-validators
    }),
    check('password','el password debe ser de al menos 6 caracteres').isLength({min:6}),
    //check('rol','No es un rol permitido').isIn(['ADMIN_ROL','USER_ROL']),
    check('rol').custom(async (rol)=>{
        await esRolValido(rol); //llamo a la funcion personalizada de /helpers/db-validators
    }),
    //como hay validaciones "checks" para que se muestren los mensajes de error
    //llamo al middleware /middlewares/validar-campos
    validarCampos 

], usuariosPost); //middleware como 2do parametro

//en el put se pasa el ID del usuario
router.put('/:id',[
    check('id','No es un ID valido').isMongoId(), //valido si es un ID valido para mongo NECESARIO
    check('id').custom(async (id)=>{
        await existeUsuario(id);
    }),
    check('rol').custom(async (rol)=>{
        await esRolValido(rol);
    }),
    validarCampos
],usuariosPut);

router.delete('/:id',[
    validarJWT,
    // esAdminRol,
    tieneRol('ADMIN_ROL'),
    check('id','No es un ID valido').isMongoId(), //valido si es un ID valido para mongo NECESARIO
    check('id').custom(async (id)=>{
        await existeUsuario(id);
    }),
    validarCampos
], usuariosDelete);

module.exports= router