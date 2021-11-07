'use strict'

let Producto = require('../models/producto');

const registro_producto = async function (req, res) {
    if(req.user){
        // if(req.user.role == 'admin'){

        // }

        if(req.user.role == 'vendedor'){
            let data = req.body;
            console.log(req.files);
            console.log(data);

            let img_path = req.files.portada.path;
            let name = img_path.split('\\');
            let portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            console.log(data);
            data.portada = portada_name;
            let producto = await Producto.create(data);

            res.status(200).send({data: producto});
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

module.exports = {
    registro_producto
}