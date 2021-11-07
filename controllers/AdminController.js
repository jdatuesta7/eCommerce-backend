'use strict'

var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');


const registro_admin = async function (req, res) {

    var data = req.body;

    var admins_arr = [];

    admins_arr = await Admin.find({email:data.email});

    if(admins_arr.length == 0){

        if(data.password){
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if(hash){
                    data.password = hash;
                    var reg = await Admin.create(data);
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

const login_admin = async function (req, res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({email: data.email});

    if(admin_arr == 0){
        res.status(200).send({message: 'El correo no se encuentra registrado', data: undefined });
    }else{
        //Login
        let user = admin_arr[0];

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

const listar_vendedores_filtro_admin = async function (req, res) {
    if(req.user){
        if(req.user.role = 'admin'){
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];

            if(tipo == 'null' || tipo == null){
                let vendedores = await Admin.find({rol: new RegExp('vendedor', 'i')});
                res.status(200).send({
                    data: vendedores
                });
            }else{
                if(tipo == 'correo'){
                    let vendedores = await Admin.find({email: new RegExp(filtro, 'i')});
                    res.status(200).send({
                        data: vendedores
                    });
                }else if(tipo == 'apellidos'){
                    let vendedores = await Admin.find({apellidos: new RegExp(filtro, 'i')});
                    res.status(200).send({
                        data: vendedores
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

const registro_vendedores_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){

            var data = req.body;

            var admins_arr = [];

            admins_arr = await Admin.find({email:data.email});

            if(admins_arr.length == 0){

                if(data.password){
                    bcrypt.hash(data.password, null, null, async function (err, hash) {
                        if(hash){
                            data.password = hash;
                            var reg = await Admin.create(data);
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
    }
}

const obtener_vendedor_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){

            var idVendedor = req.params['id'];

            try {
                var vendedor = await Admin.findById({_id: idVendedor});
                res.status(200).send({data: vendedor});
            } catch (error) {
                res.status(200).send({message:'VendedorNotFound' ,data: undefined});
            }

        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const actualizar_vendedor_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            
            var idVendedor = req.params['id'];
            var params = req.body;
            
            try {
                Admin.findById(idVendedor).exec((err, data) => {
                    if(err || !data){
                        return res.status(404).send({status: 'error', message: 'No se ha encontrado el usuario'});
                    }

                    Admin.findOne({email: params.email.toLowerCase()}, (err, data)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al intentar actualizar datos'});
                        }

                        if(data && data.email == params.email && data._id != idVendedor){
                            return res.status(400).send({message: 'El email ya esta registrado.'});
                        }else{
                            Admin.findByIdAndUpdate({_id: idVendedor}, params, {new: true}, (err, data)=>{
                                if(err || !data){
                                    return res.status(500).send({status: 'error', message: "Error al actualizar usuario"});
                                }
                                return res.status(200).send({status: 'success', message: 'Usuario actualizado', data:data});
                            })
                        }
                    });
                    
                });
            } catch (error) {
                console.log(error);
                res.status(500).send({message: 'Ha ocurrido un error, intenta de nuevo'});
            }

        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const eliminar_vendedor_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            var idVendedor = req.params['id'];

            var reg = await Admin.findByIdAndRemove({_id: idVendedor});

            res.status(200).send({data : reg});
        }
    }
}

module.exports = {
    registro_admin,
    login_admin,
    listar_vendedores_filtro_admin,
    registro_vendedores_admin,
    obtener_vendedor_admin,
    actualizar_vendedor_admin,
    eliminar_vendedor_admin
}