'use strict'

let Producto = require('../models/producto');
let Inventario = require('../models/inventario');
let Admin = require('../models/admin');

let fs = require('fs');
let path = require('path');

//METODOS PANEL ADMIN
const registro_producto = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            res.status(500).send({ message: 'Usted no es un vendedor' });
        }

        if (req.user.role == 'vendedor') {
            let data = req.body;

            let img_path = req.files.portada.path;
            let name = img_path.split('\\');
            let portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            data.portada = portada_name;
            console.log(data);
            let producto = await Producto.create(data);

            let vendedor = await Admin.findById({ _id: req.user.sub });

            let inventario = await Inventario.create({
                producto: producto._id,
                cantidad: data.stock,
                admin: req.user.sub,
                proveedor: vendedor.nombre_local
            });

            res.status(200).send({ data: producto, inventario: inventario });
        } else {
            res.status(500).send({ message: 'UnauthorizedAccess' });
        }
    } else {
        res.status(500).send({ message: 'UnauthorizedAccess' });
    }
}

const listar_productos = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin' || req.user.role == 'vendedor') {

            if (req.user.role == 'admin') {
                let filtro = req.params['filtro'];
                let productos = await Producto.find({ titulo: new RegExp(filtro, 'i') });
                res.status(200).send({ data: productos });
            }

            if (req.user.role == 'vendedor') {
                let id = req.params['id'];
                let filtro = req.params['filtro'];
                let productos = await Producto.find({ titulo: new RegExp(filtro, 'i'), admin: id });
                res.status(200).send({ data: productos });
            }
        } else {
            res.status(500).send({ message: 'UnauthorizedAccess' });
        }
    } else {
        res.status(500).send({ message: 'UnauthorizedAccess' });
    }
}

const obtener_producto = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin' || req.user.role == 'vendedor') {
            let idProducto = req.params['id'];

            try {
                let producto = await Producto.findById({ _id: idProducto });
                res.status(200).send({ data: producto });
            } catch (error) {
                res.status(200).send({ message: 'ProductNotFound', data: undefined });
            }
        } else {
            res.status(500).send({ message: 'UnauthorizedAccess' });
        }
    } else {
        res.status(500).send({ message: 'UnauthorizedAccess' });
    }
}

const actualizar_producto = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin' || req.user.role == 'vendedor') {
            // if(req.user.role == 'admin'){
            //     res.status(500).send({message: 'Usted no es un vendedor'});
            // }

            if (req.user.role == 'vendedor' || req.user.role == 'admin') {
                let id = req.params['id'];
                let data = req.body;

                if (req.files) {
                    //Si hay imagen
                    let img_path = req.files.portada.path;
                    let name = img_path.split('\\');
                    let portada_name = name[2];

                    let producto = await Producto.findByIdAndUpdate({_id: id},{
                        titulo: data.titulo,
                        stock: data.stock,
                        precio: data.precio,
                        categoria: data.categoria,
                        descripcion: data.descripcion,
                        contenido: data.contenido,
                        slug: data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,''),
                        portada: portada_name
                    });

                    res.status(200).send({data: producto});
                } else {
                    //No hay imagen
                    let producto = await Producto.findByIdAndUpdate({_id: id},{
                        titulo: data.titulo,
                        stock: data.stock,
                        precio: data.precio,
                        categoria: data.categoria,
                        descripcion: data.descripcion,
                        contenido: data.contenido,
                        slug: data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
                    });
                    res.status(200).send({data: producto});
                }

                // let inventario = await Inventario.create({
                //     producto : producto._id,
                //     cantidad : data.stock,
                //     admin : req.user.sub,
                //     proveedor : vendedor.nombre_local
                // });
            } else {
                res.status(500).send({ message: 'UnauthorizedAccess' });
            }
        } else {
            res.status(500).send({ message: 'UnauthorizedAccess' });
        }
    }
}

const agregar_imagen_galeria_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin' || req.user.role == 'vendedor') {
            let idProducto = req.params['id'];
            console.log(idProducto);
            let data = req.body;

            let img_path = req.files.imagen.path;
            let name = img_path.split('\\');
            let imagen_name = name[2];

            let reg = await Producto.findByIdAndUpdate({ _id: idProducto }, {
                $push: {
                    galeria: {
                        imagen: imagen_name,
                        _id: data._id
                    }
                }
            });

            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'UnauthorizedAccess' });
        }
    } else {
        res.status(500).send({ message: 'UnauthorizedAccess' });
    }
}

const eliminar_imagen_galeria_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin' || req.user.role == 'vendedor') {
            let idProducto = req.params['id'];
            let data = req.body;

            let reg = await Producto.findByIdAndUpdate({ _id: idProducto }, { $pull: { galeria: { _id: data._id } } });

            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'UnauthorizedAccess' });
        }
    } else {
        res.status(500).send({ message: 'UnauthorizedAccess' });
    }
}

const eliminar_producto_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin' || req.user.role == 'vendedor'){
            var idProducto = req.params['id'];

            let reg = await Producto.findByIdAndRemove({_id: idProducto});

            res.status(200).send({data : reg});
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

//METODOS PUBLICOS
const obtener_portada = async function (req, res) {
    var img = req.params['img'];

    fs.stat('./uploads/productos/' + img, function (err) {
        if (!err) {
            let path_img = './uploads/productos/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/default-placeholder.png';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const listar_productos_publicos = async function (req, res) {
    let filtro = req.params['filtro'];
    let productos = await Producto.find({ titulo: new RegExp(filtro, 'i') }).populate('admin').sort({ createdAt: -1 });
    res.status(200).send({ data: productos });
}

const listar_productos_recomendados_publicos = async function (req, res) {
    let categoria = req.params['categoria'];
    let productos = await Producto.find({ categoria: categoria }).populate('admin').sort({ nventas: -1 }).limit(8);
    res.status(200).send({ data: productos });
}

const listar_productos_nuevos_publicos = async function (req, res) {
    let productos = await Producto.find().sort({ createdAt: -1 }).limit(12);
    res.status(200).send({ data: productos });
}

const listar_productos_tendencia_publicos = async function (req, res) {
    let productos = await Producto.find().sort({ nventas: -1 }).limit(8).populate('admin');
    res.status(200).send({ data: productos });
}

const listar_productos_vendedor_publicos = async function (req, res) {
    let id = req.params['local'];
    let productos = await Producto.find({ admin: id });
    res.status(200).send({ data: productos });
}

const obtener_producto_publico = async function (req, res) {
    try {
        let slug = req.params['slug'];
        let producto = await Producto.findOne({ slug: slug }).populate('admin');
        res.status(200).send({ data: producto });
    } catch (error) {
        res.status(200).send({ message: 'ProductNotFound', data: undefined });
    }
}

//INVENTARIO
const listar_inventario_producto = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin' || req.user.role == 'vendedor') {

            let idProducto = req.params['id'];

            let inventarios = await Inventario.find({ producto: idProducto }).populate('admin').sort({ createdAt: -1 });

            res.status(200).send({ data: inventarios });

        } else {
            res.status(500).send({ message: 'UnauthorizedAccess' });
        }
    } else {
        res.status(500).send({ message: 'UnauthorizedAccess' });
    }
}

const eliminar_inventario_producto = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin' || req.user.role == 'vendedor') {

            let idInventario = req.params['id'];

            let inventarioEliminado = await Inventario.findByIdAndDelete({ _id: idInventario });

            let producto = await Producto.findById({ _id: inventarioEliminado.producto });

            let nuevo_stock = parseInt(producto.stock) - parseInt(inventarioEliminado.cantidad);

            let productoActualizado = await Producto.findByIdAndUpdate({ _id: inventarioEliminado.producto }, {
                stock: nuevo_stock
            });

            res.status(200).send({ data: productoActualizado });

        } else {
            res.status(500).send({ message: 'UnauthorizedAccess' });
        }
    } else {
        res.status(500).send({ message: 'UnauthorizedAccess' });
    }
}

const registro_inventario_producto = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin' || req.user.role == 'vendedor') {

            let data = req.body;
            data.admin = req.user.sub;

            let inventario = await Inventario.create(data);

            let producto = await Producto.findById({ _id: inventario.producto });

            let nuevo_stock = parseInt(producto.stock) + parseInt(inventario.cantidad);

            let productoActualizado = await Producto.findByIdAndUpdate({ _id: inventario.producto }, {
                stock: nuevo_stock
            });

            res.status(200).send({ data: inventario });

        } else {
            res.status(500).send({ message: 'UnauthorizedAccess' });
        }
    } else {
        res.status(500).send({ message: 'UnauthorizedAccess' });
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
    actualizar_producto,
    listar_productos_nuevos_publicos,
    listar_productos_tendencia_publicos,
    listar_productos_vendedor_publicos,
    obtener_producto_publico,
    listar_productos_recomendados_publicos,
    eliminar_producto_admin
}