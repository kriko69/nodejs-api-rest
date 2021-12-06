const { request, response } = require("express");


const esAdminRol = (req=request,res=response,next)=>{
    if(!req.user)
    {
        return res.status(500).json({
            "msg":"Se quiere verificar el rol sin verificar el token primero"
        });
    }

    const {rol,nombre}=req.user;

    if(rol!=='ADMIN_ROL')
    {
        return res.status(500).json({
            "msg":`El usuario ${nombre} no es administrador. o puede hacer esto.`
        });
    }

    return next();
};

const tieneRol=(...roles)=>{
    return (req=request,res=response,next)=>{
        console.log(roles);

        const {rol,nombre}=req.user;

        if(!roles.includes(rol))
        {
            return res.status(401).json({
                "msg":`El usuario ${nombre} debe tener algunos de estos roles ${roles}`
            });
        }
        next(); 
    };

};
module.exports={
    esAdminRol,
    tieneRol
}