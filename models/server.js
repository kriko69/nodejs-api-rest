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

class Server {

    constructor(){
        //inicializamos la instancia de express
        this.app = express();
        //definimos el puerto del servidor con el valor de la variable de entorno PORT
        this.port = process.env.PORT;
        //definimos un path general para usuario como API
        this.usuariosPath='/api/users';

        //conexion base de datos
        this.DBconnection();

        //middleware
        this.middleware();

        //routes
        this.routes();
    }

    routes(){
        //invocamos las rutas de usuarios
        this.app.use(this.usuariosPath,require('../routes/user'));

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