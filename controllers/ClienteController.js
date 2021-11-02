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
    // console.log(req.user);
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

const registro_clientes_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            
            // var data = req.body;

            // bcrypt.hash(data.password, null, null, async function (err, hash) {
            //     if(hash){
            //         data.password = hash;
            //         let reg = await Cliente.create(data);
            //         res.status(200).send({data: reg});
            //     }else{
            //         res.status(200).send({message: 'Hubo un error en el servidor (bcrypt password failed)', data: undefined});
            //     }
            // });

            // Verificar si existe correo

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

        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const obtener_cliente_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){

            let idCliente = req.params['id'];

            try {
                let cliente = await Cliente.findById({_id: idCliente});
                res.status(200).send({data: cliente});
            } catch (error) {
                res.status(200).send({message:'CustomerNotFound' ,data: undefined});
            }

        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const actualizar_cliente_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            
            var idCliente = req.params['id'];
            var data = req.body;
            
            var cliente = await Cliente.findByIdAndUpdate({_id: idCliente},{
                nombres : data.nombres,
                apellidos : data.apellidos,
                ciudad : data.ciudad,
                email : data.email,
                telefono : data.telefono,
                genero : data.genero,
                f_nacimiento : data.f_nacimiento,
                dni : data.dni
            });

            res.status(200).send({data: cliente});

        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const eliminar_cliente_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            var idCliente = req.params['id'];

            let reg = await Cliente.findByIdAndRemove({_id: idCliente});

            res.status(200).send({data : reg});
        }
    }
}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_clientes_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin
}