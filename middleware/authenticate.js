'use strict'

var jwt = require('jwt-simple'); //decodificar tokens
var moment = require('moment'); 
var secret = 'secret123';

exports.auth = function(req, res, next){

    if(!req.headers.authorization){
        console.log('NoHeadersError');
        return res.status(403).send({message: 'NoHeadersError'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');

    var segment = token.split('.');


    if(segment.length != 3){
        console.log('InvalidToken');
        return res.status(403).send({message: 'InvalidToken'});
    }else{
        try {
            var payload = jwt.decode(token, secret);
            // console.log(payload);
            if(payload.exp <= moment().unix()){
                console.log('TokenExpired');
                return res.status(403).send({message: 'TokenExpired'});
            }
        } catch (error) {
            console.log('InvalidToken');
            return res.status(403).send({message: 'InvalidToken'});
        }
    }

    req.user = payload;

    next();
}