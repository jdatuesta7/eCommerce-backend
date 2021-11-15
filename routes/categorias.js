'use strict'

var express = require('express');
var categoriasController = require('../controllers/CategoriasController');

var api = express.Router();
var auth = require('../middleware/authenticate');

api.put('/actualizar_categorias_admin/:id', auth.auth, categoriasController.actualizar_categorias_admin);
api.get('/obtener_categorias_admin', auth.auth, categoriasController.obtener_categorias_admin);
api.get('/obtener_categorias_publico', categoriasController.obtener_categorias_publico);


module.exports = api;