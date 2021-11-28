'use strict'

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Direccion = require('../models/direccion')


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

const obtener_cliente_guest = async function (req, res) {

    if(req.user){
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

}

const actualizar_perfil_cliente_guest = async function (req, res) {
    if(req.user){
        let idCliente = req.params['id'];
        let data = req.body;

        if(data.password){
            console.log('Con contraseña');
            bcrypt.hash(data.password, null, null, async  function (err, hash) {
                let cliente = await Cliente.findByIdAndUpdate({_id: idCliente}, {
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    dni: data.dni,
                    genero: data.genero,
                    ciudad: data.ciudad,
                    password: hash,
                });
                res.status(200).send({data: cliente});
            });
        }else{
            console.log('Sin contraseña');
            let cliente = await Cliente.findByIdAndUpdate({_id: idCliente}, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero,
                ciudad: data.ciudad
            });

            res.status(200).send({data: cliente});
        }
        
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

// METODOS PANEL ADMINISTRADOR
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
            
            const idCliente = req.params['id'];
            const params = req.body;
            
            try {

                Cliente.findById(idCliente).exec((err, data) => {
                    if(err || !data){
                        return res.status(404).send({status: 'error', message: 'No se ha encontrado el cliente'});
                    }

                    Cliente.findOne({email: params.email.toLowerCase()}, (err, data)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al intentar actualizar datos'});
                        }

                        if(data && data.email == params.email && data._id != idCliente){
                            return res.status(400).send({message: 'El email ya esta registrado.'});
                        }else{
                            Cliente.findByIdAndUpdate({_id: idCliente}, params, {new: true}, (err, data)=>{
                                if(err || !data){
                                    return res.status(500).send({status: 'error', message: "Error al actualizar usuario"});
                                }
                                return res.status(200).send({status: 'success', message: 'Usuario actualizado', data:data});
                            })
                        }
                    })
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

const eliminar_cliente_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            var idCliente = req.params['id'];

            let reg = await Cliente.findByIdAndRemove({_id: idCliente});

            res.status(200).send({data : reg});
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
    listar_clientes_filtro_admin,
    registro_clientes_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest
}