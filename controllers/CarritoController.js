var Carrito = require('../models/carrito');

const agregar_carrito_cliente = async function (req, res) {
    if(req.user){
        let data = req.body;

        let carrito_cliente = await Carrito.findOne({cliente: data.cliente, producto: data.producto});
        
        if(!carrito_cliente){
            let reg = await Carrito.create(data);
            res.status(200).send({data: reg});
        }else if(carrito_cliente){
            let nuevaCantidad = parseInt(data.cantidad) + parseInt(carrito_cliente.cantidad);
            let reg = await Carrito.findByIdAndUpdate({_id: carrito_cliente._id}, {cantidad: nuevaCantidad});
            res.status(200).send({data: reg});
        }

    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const obtener_carrito_cliente = async function (req, res) {
    if(req.user){
        let idCliente = req.params['id'];

        let carrito_cliente = await Carrito.find({cliente: idCliente}).populate('producto');

        res.status(200).send({data: carrito_cliente});
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const eliminar_carrito_cliente = async function (req, res) {
    if(req.user){
        let id = req.params['id'];

        let reg = await Carrito.findOneAndRemove({_id: id});
        res.status(200).send({data: reg});
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const disminuir_carrito_cantidad = async function (req, res){
    if(req.user){
        let data = req.body;

        let carrito_cliente = await Carrito.findOne({cliente: data.cliente, producto: data.producto});
        
        if(carrito_cliente){
            let nuevaCantidad = parseInt(carrito_cliente.cantidad) - parseInt(data.cantidad);
            let reg = await Carrito.findByIdAndUpdate({_id: carrito_cliente._id}, {cantidad: nuevaCantidad});
            res.status(200).send({data: reg});
        }else{
            res.status(404).send({message: 'ElementNotFound'});
        }

    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

module.exports = {
    agregar_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente,
    disminuir_carrito_cantidad
}