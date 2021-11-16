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
api.get('/obtener_portada/:img', productoController.obtener_portada);
api.get('/obtener_producto/:id', auth.auth, productoController.obtener_producto);
api.put('/actualizar_producto/:id', auth.auth, productoController.actualizar_producto);
api.put('/agregar_imagen_galeria_admin/:id', [auth.auth, path], productoController.agregar_imagen_galeria_admin);
api.put('/eliminar_imagen_galeria_admin/:id', auth.auth, productoController.eliminar_imagen_galeria_admin);

//INVENTARIOS
api.get('/listar_inventario_producto/:id', auth.auth, productoController.listar_inventario_producto);
api.delete('/eliminar_inventario_producto/:id', auth.auth, productoController.eliminar_inventario_producto);
api.post('/registro_inventario_producto', auth.auth, productoController.registro_inventario_producto);

//PUBLICOS
api.get('/listar_productos_publicos/:filtro?', productoController.listar_productos_publicos);

module.exports = api;