'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CuponSchema = schema({
    codigo: {type: String, required: true},
    tipo: {type: String, required: true},
    valor: {type: Number, required: true},
    limite: {type: Number, required: true},
    createdAt : {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model('cupones', CuponSchema);