'use strict'

let Producto = require('../models/producto');
let Inventario = require('../models/inventario');
let Admin = require('../models/admin');

let fs = require('fs');
let path = require('path');

//PRODUCTOS
const registro_producto = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            res.status(500).send({message: 'Usted no es un vendedor'});
        }

        if(req.user.role == 'vendedor'){
            let data = req.body;

            let img_path = req.files.portada.path;
            let name = img_path.split('\\');
            let portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            data.portada = portada_name;
            console.log(data);
            let producto = await Producto.create(data);

            let vendedor = await Admin.findById({_id: req.user.sub});

            let inventario = await Inventario.create({
                producto : producto._id,
                cantidad : data.stock,
                admin : req.user.sub,
                proveedor : vendedor.nombre_local
            });

            res.status(200).send({data: producto, inventario: inventario});
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

const obtener_producto = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){
            let idProducto = req.params['id'];

            try {
                let producto = await Producto.findById({_id: idProducto});
                res.status(200).send({data: producto});
            } catch (error) {
                res.status(200).send({message:'ProductNotFound' ,data: undefined});
            }
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

//INVENTARIO
const listar_inventario_producto = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){
            let idProducto = req.params['id'];

            let inventarios = Inventario.findById({ producto: idProducto});
            res.status(200).send({data: inventarios});
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

module.exports = {
    registro_producto,
    listar_productos,
    obtener_portada,
    obtener_producto,
    listar_inventario_producto
}