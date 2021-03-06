'use strict'

var express = require('express');
var adminController = require('../controllers/AdminController');

var api = express.Router();
var auth = require('../middleware/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/vendedores'});

api.get('/', adminController.root);
api.post('/registro_admin', adminController.registro_admin);
api.post('/login_admin', adminController.login_admin);
api.get('/listar_vendedores_filtro_admin/:tipo/:filtro?', auth.auth, adminController.listar_vendedores_filtro_admin);
api.post('/registro_vendedor_admin', [auth.auth, path], adminController.registro_vendedores_admin);
api.get('/obtener_vendedor_admin/:id', auth.auth, adminController.obtener_vendedor_admin);
api.put('/actualizar_vendedor_admin/:id', auth.auth, adminController.actualizar_vendedor_admin);
api.delete('/eliminar_vendedor_admin/:id', auth.auth, adminController.eliminar_vendedor_admin);
api.get('/listar_vendedores_filtro_publico/:filtro?', adminController.listar_vendedores_filtro_publico);
api.get('/obtener_logo/:img', adminController.obtener_logo);
api.get('/obtener_vendedor_publico/:id', adminController.obtener_vendedor_publico);


module.exports = api;