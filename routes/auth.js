const {Router} = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { login, google } = require('../controllers/auth');
const { correoExiste } = require('../helpers/db-validators');

//constante necesario para la creacion de las rutas
const router = Router();

router.post('/login',[
    check('correo','El correo es obligatorio.').isEmail(),
    check('password','El password es obligatorio.').not().isEmpty(),
    validarCampos 

], login); //middleware como 2do parametro

router.post('/google',[
    check('id_token','ID token google es obligatorio.').not().isEmpty(),
    validarCampos 

], google); 


module.exports=router;