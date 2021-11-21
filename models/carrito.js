'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CarritoSchema = schema({
    producto: {type: schema.ObjectId, ref: 'producto', required: true},
    cliente: {type: schema.ObjectId, ref: 'cliente', required: true},
    cantidad: {type: Number, require: true},
    createdAt: {type: Date, default: Date.now, require: true}
});

module.exports = mongoose.model('carrito', CarritoSchema);