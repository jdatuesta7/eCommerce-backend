'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var clienteSchema = schema({
    nombres: {type: String, required: true},
    apellidos: {type: String, required: true},
    ciudad: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    perfil: {type: String, default: 'perfil.png', required: true},
    telefono: {type: String, required: true},
    genero: {type: String, required: true},
    f_nacimiento: {type: String, required: true},
    dni: {type: String, required: true},
});

module.exports = mongoose.model('cliente', clienteSchema);