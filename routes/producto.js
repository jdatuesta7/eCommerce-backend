'use strict'

var express = require('express');
var productoController = require('../controllers/ProductoController');
var api = express.Router();
var auth = require('../middleware/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/productos'});

api.post('/registro_producto', [auth.auth, path], productoController.registro_producto);
api.get('/listar_productos/:id?/:filtro?', auth.auth, productoController.listar_productos);
api.get('/obtener_portada/:img/', productoController.obtener_portada);


module.exports = api;