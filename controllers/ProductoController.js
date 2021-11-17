'use strict'

let Producto = require('../models/producto');
let Inventario = require('../models/inventario');
let Admin = require('../models/admin');

let fs = require('fs');
let path = require('path');

//METODOS PANEL ADMIN
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
const actualizar_producto = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){
            
            const idProducto = req.params['id'];
            const params = req.body;
            
            try {

                Producto.findById(idProducto).exec((err, data) => {
                    if(err || !data){
                        return res.status(404).send({status: 'error', message: 'No se ha encontrado el producto'});
                    }

                    Producto.findOne({id: params.id.toLowerCase()}, (err, data)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al intentar actualizar datos'});
                        }

                        if(data && data.id == params.id && data._id != idProducto){
                            return res.status(400).send({message: 'El producto ya se encuentra registrado.'});
                        }else{
                            Producto.findByIdAndUpdate({_id: idProducto}, params, {new: true}, (err, data)=>{
                                if(err || !data){
                                    return res.status(500).send({status: 'error', message: "Error al actualizar producto"});
                                }
                                return res.status(200).send({status: 'success', message: 'Usuario actualizado', data:data});
                            })
                        }
                    })
                });

            } catch (error) {
                console.log(error);
                res.status(500).send({message: 'Ha ocurrido un error, intenta de nuevo'});
            }

        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const agregar_imagen_galeria_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){
            let idProducto = req.params['id'];
            console.log(idProducto);
            let data = req.body;

            let img_path = req.files.imagen.path;
            let name = img_path.split('\\');
            let imagen_name = name[2];

            let reg = await Producto.findByIdAndUpdate({_id: idProducto},{ $push: {galeria: {
                imagen: imagen_name,
                _id: data._id
            }}});

            res.status(200).send({data: reg});
            
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const eliminar_imagen_galeria_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){
            let idProducto = req.params['id'];
            let data = req.body;

            let reg = await Producto.findByIdAndUpdate({_id: idProducto},{$pull: {galeria: {_id: data._id}}});

            res.status(200).send({data: reg});
            
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

//METODOS PUBLICOS
const listar_productos_publicos = async function (req, res) {
    
    let filtro = req.params['filtro'];
    let productos = await Producto.find({titulo: new RegExp(filtro, 'i')}).populate('admin');
    res.status(200).send({data: productos});

}

//INVENTARIO
const listar_inventario_producto = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){
           
            let idProducto = req.params['id'];

            let inventarios = await Inventario.find({ producto: idProducto}).populate('admin').sort({createdAt: -1});

            res.status(200).send({data: inventarios});
            
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const eliminar_inventario_producto = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){
           
            let idInventario = req.params['id'];
            
            let inventarioEliminado = await Inventario.findByIdAndDelete({_id: idInventario});

            let producto = await Producto.findById({_id: inventarioEliminado.producto});

            let nuevo_stock = parseInt(producto.stock) - parseInt(inventarioEliminado.cantidad);

            let productoActualizado = await Producto.findByIdAndUpdate({_id: inventarioEliminado.producto}, {
                stock : nuevo_stock
            });

            res.status(200).send({data: productoActualizado});
            
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const registro_inventario_producto = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){
           
            let data = req.body;
            data.admin = req.user.sub;

            let inventario = await Inventario.create(data);

            let producto = await Producto.findById({_id: inventario.producto});
            
            let nuevo_stock = parseInt(producto.stock) + parseInt(inventario.cantidad);

            let productoActualizado = await Producto.findByIdAndUpdate({_id: inventario.producto}, {
                stock : nuevo_stock
            });

            res.status(200).send({data: inventario});
            
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
    listar_inventario_producto,
    eliminar_inventario_producto,
    registro_inventario_producto,
    listar_productos_publicos,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin,
    actualizar_producto
}