var Carrito = require('../models/carrito');

const agregar_carrito_cliente = async function (req, res) {
    if(req.user){
        let data = req.body;

        let carrito_cliente = await Carrito.findOne({cliente: data.cliente, producto: data.producto});
        if(carrito_cliente){
            
        }else if(!carrito_cliente){
           
        }
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

module.exports = {
    agregar_carrito_cliente
}