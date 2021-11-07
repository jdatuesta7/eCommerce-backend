'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var productoSchema = schema({
    titulo: {type: String, required: true},
    slug: {type: String, required: true},
    galeria: [{type: Object, required: false}],
    portada: {type: String, required: true},
    precio: {type: Number, required: true},
    descripcion: {type: String, required: true},
    contenido: {type: String, required: true},
    stock: {type: Number, required: true},
    nventas: {type: Number, default: 0, required: true},
    categoria: {type: String, required: true},
    estado: {type: String, default: 'Edicion', required: true},
    createdAt : {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('producto', productoSchema);