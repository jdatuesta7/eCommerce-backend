'use strict'

var express = require('express');
var cuponController = require('../controllers/CuponController');

var api = express.Router();
var auth = require('../middleware/authenticate');

api.post('/registro_cupon_admin', auth.auth, cuponController.registro_cupon_admin);

module.exports = api;