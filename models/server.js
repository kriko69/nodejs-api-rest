/**
 * Este es el modelo del servidor, aqui levantamos el servidor para tener mas limpio el app.js
 * lo llamamos desde el app.js
 */

//invocamos express
const express = require('express');
//invocamos todas las variables de entorno definidas en .env
require('dotenv').config();
//invocamos el middleware del cors
const cors = require('cors');
//invocamos la conexion con mongo
const { connection } = require('../database/config');

const fileUpload = require('express-fileupload');
class Server {

    constructor(){
        //inicializamos la instancia de express
        this.app = express();
        //definimos el puerto del servidor con el valor de la variable de entorno PORT
        this.port = process.env.PORT;
        //definimos un path general para usuario como API
        //this.usuariosPath='/api/users';
        //this.authPath='/api/auth';
        //this.categoriasPath='/api/categorias';

        this.paths={
            users:'/api/users',
            auth:'/api/auth',
            categorias:'/api/categorias',
            productos:'/api/productos',
            buscar:'/api/buscar',
            upload:'/api/upload'
        }

        //conexion base de datos
        this.DBconnection();

        //middleware
           this.middleware();

        //routes
        this.routes();
    }

    routes(){
        //invocamos las rutas de usuarios
        this.app.use(this.paths.users,require('../routes/user'));
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.categorias,require('../routes/categoria'));
        this.app.use(this.paths.productos,require('../routes/producto'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.upload,require('../routes/upload'));

    }

    async DBconnection(){
        //esperamos la conexion
        await connection();
    }

    middleware(){
        //directorio public
        this.app.use(express.static('public'));
        //llamamos el middleware de CORS
        this.app.use(cors());

        //LECTURA Y PARSEO DEL BODY todo lo que llega lo serializa a json
        this.app.use(express.json());

        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));

    }

    //funcion para levantar el servidor
    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en puerto: '+this.port);
        });
    }

}

//exportamos la clase
module.exports=Server;