'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CategoriaSchema = schema({
    categorias: [{type: Object, required: true}],
});

module.exports = mongoose.model('categoria', CategoriaSchema);