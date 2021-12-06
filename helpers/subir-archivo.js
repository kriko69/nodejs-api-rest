const { response } = require("express");
const {v4:uuid4} = require('uuid');
const path = require('path');
const { resolve } = require("path");

const subirArchivo=(files,extensionesValidas=['png','jpg','jpeg','gif'],carpeta='')=>{

    return new Promise((resolve,reject)=>{
        const {archivo} = files;
        const extensiones_validas = extensionesValidas;
        const spliter=archivo.name.split('.');
        const extension_archivo=spliter[spliter.length-1];

        if(!extensiones_validas.includes(extension_archivo))
        {
            return reject(`La extension ${extension_archivo} no esta permitida. Solo se acepta ${extensiones_validas}`);
        }

        const tempName=uuid4()+'.'+extension_archivo;

        uploadPath =path.join(__dirname ,'../uploads/',carpeta, tempName);

        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, function(err) {
            if (err)
                return reject(err)

            resolve({
                msg:`El archivo fue cargado correctamente.`,
                nombre:`${tempName}`
            });
        });
    });

};


module.exports={
    subirArchivo
};