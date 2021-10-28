'use strict'

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_cliente = async function (req, res) {

    var data = req.body;

    var clientes_arr = [];
    clientes_arr = await Cliente.find({email:data.email});

    if(clientes_arr.length == 0){

        if(data.password){
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if(hash){
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({data: reg});
                }else{
                    res.status(200).send({message: 'Error Server', data: undefined})
                }
            })
        }else{
            res.status(200).send({message: 'No hay una contraseña', data: undefined});
        }
       
    }else{
        res.status(200).send({message: 'El correo ya existe en la base de datos', data:undefined});
    }
    
}

const login_cliente = async function (req, res) {
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({email: data.email});

    if(cliente_arr == 0){
        res.status(200).send({message: 'El correo no se encuentra registrado', data: undefined });
    }else{
        //Login
        let user = cliente_arr[0];

        bcrypt.compare(data.password, user.password, async function (err, check) {
            if(check){
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            }else{
                res.status(200).send({message: 'La contraseña es incorrecta', data: undefined });
            }
        })
    }
}

const listar_clientes_filtro_admin = async function (req, res) {
    console.log(req.user);
    if(req.user){
        if(req.user.role == 'admin'){
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];

            if(tipo == 'null' || tipo == null){
                let clientes = await Cliente.find();
                res.status(200).send({
                    data: clientes
                });
            }else{
                if(tipo == 'correo'){
                    let clientes = await Cliente.find({email: new RegExp(filtro, 'i')});
                    res.status(200).send({
                        data: clientes
                    });
                }else if(tipo == 'apellidos'){
                    let clientes = await Cliente.find({apellidos: new RegExp(filtro, 'i')});
                    res.status(200).send({
                        data: clientes
                    });
                }
            }
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin
}