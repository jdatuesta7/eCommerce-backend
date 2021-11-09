'use strict'

let Producto = require('../models/producto');
let fs = require('fs');
let path = require('path');

const registro_producto = async function (req, res) {
    if(req.user){
        // if(req.user.role == 'admin'){

        // }

        if(req.user.role == 'vendedor'){
            let data = req.body;
            // console.log(req.files);

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

const listar_productos = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){

            if(req.user.role == 'admin'){
                let filtro = req.params['filtro'];
                let productos = await Producto.find({titulo: new RegExp(filtro, 'i')});
                res.status(200).send({data: productos});
            }

            if(req.user.role == 'vendedor'){
                let id = req.params['id'];
                let filtro = req.params['filtro'];
                let productos = await Producto.find({titulo: new RegExp(filtro, 'i'), admin: id});
                res.status(200).send({data: productos});
            }
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const obtener_portada = async function (req, res) {
    var img = req.params['img'];
    
    console.log(img);
    fs.stat('./uploads/productos/'+img, function (err) {
        if(!err){
            let path_img = './uploads/productos/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default-placeholder.png';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}   

module.exports = {
    registro_producto,
    listar_productos,
    obtener_portada
}