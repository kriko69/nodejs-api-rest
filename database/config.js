/*
Este archivo contiene la conexion de la base de datos, esta separado solo para realizar la conexion

*/

const mongoose = require('mongoose');
require('dotenv').config();

const connection=async () =>{
    try {
        //esperamos a que conecte con el await
        await mongoose.connect(process.env.MONGODB_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology : true,
            //useCreateIndex: true,
            //useFindAndModify: false
        });

        console.log('Base de datos online');
    } catch (error) {

        //mandamos error y creamos uno personalizado
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

//exportamos
module.exports={
    connection
}