'use strict'

var express = require('express');
var carritoController = require('../controllers/CarritoController');

var api = express.Router();
var auth = require('../middleware/authenticate');

api.post('/agregar_carrito_cliente', auth.auth, carritoController.agregar_carrito_cliente);
api.get('/obtener_carrito_cliente/:id', auth.auth, carritoController.obtener_carrito_cliente);
api.delete('/eliminar_carrito_cliente/:id', auth.auth, carritoController.eliminar_carrito_cliente);
api.post('/disminuir_carrito_cantidad', auth.auth, carritoController.disminuir_carrito_cantidad);

module.exports = api;