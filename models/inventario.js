'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var InventarioSchema = schema({
    producto: {type: schema.ObjectId, ref: 'producto', required: true},
    cantidad : {type: Number, required: true},
    admin : {type: schema.ObjectId, ref: 'admin', required: true},
    proveedor : {type: String, required: true},
    createdAt : {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model('inventario', InventarioSchema);