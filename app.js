'use strict'

var express = require('express');
var app = express();

var mongoose = require('mongoose');
app.set('port', process.env.port || 4201);

var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {origin : '*'}
});

io.on('connection', function (socket) {
    socket.on('delete-carrito', function (data) {
        io.emit('new-carrito', data);
        console.log(data);
    });

    socket.on('add-carrito-add', function (data) {
        io.emit('new-carrito-add', data);
        console.log(data);
    });
})

var cliente_route = require('./routes/cliente');
var admin_route = require('./routes/admin');
var producto_route = require('./routes/producto');
var cupon_route = require('./routes/cupon');
var categorias_route = require('./routes/categorias');
var carrito_route = require('./routes/carrito');


const bodyParser = require('body-parser');

// const databaseLocal = 'mongodb://127.0.0.1:27017/tienda';
const databaseNube = 'mongodb+srv://jatuesta99:1045761181@ecommercedb.crsxg.mongodb.net/tienda?retryWrites=true&w=majority';

mongoose.connect(databaseNube,{useUnifiedTopology: true, useNewUrlParser: true},(err, res)=>{
    if(err){
        console.log('ERROR !!!!!!!!!!!!!!! ');
        console.log(err);
    }else{
        console.log('WORKING !!!!!!!!!!!!!!! ');
        server.listen(app.get('port'), function () {
            console.log('Servidor corriendo en el puerto ' + app.get('port')); 
        });
    }
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

//Permite conexion entre el frontend y backend
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',cliente_route);
app.use('/api',admin_route);
app.use('/api',producto_route);
app.use('/api',cupon_route);
app.use('/api',categorias_route);
app.use('/api',carrito_route);
app.use(admin_route);


module.exports = app;