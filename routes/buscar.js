const {Router} = require('express');
const {check} = require('express-validator');
const { buscar } = require('../controllers/buscar');
const { validarCampos } = require('../middlewares/validar-campos');

//constante necesario para la creacion de las rutas
const router = Router();

router.get('/:coleccion/:termino',[
    /*check('categoria','El correo es obligatorio.').isEmail(),
    check('value','El password es obligatorio.').not().isEmpty(),
    validarCampos */

], buscar); //middleware como 2do parametro



module.exports=router;