'use strict'

var express = require('express');
var productoController = require('../controllers/ProductoController');
var api = express.Router();
var auth = require('../middleware/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/productos'});

//PRODUCTOS
api.post('/registro_producto', [auth.auth, path], productoController.registro_producto);
api.get('/listar_productos/:id?/:filtro?', auth.auth, productoController.listar_productos);
api.get('/obtener_portada/:img/', productoController.obtener_portada);
api.get('/obtener_producto/:id/', auth.auth, productoController.obtener_producto);

//INVENTARIOS


module.exports = api;