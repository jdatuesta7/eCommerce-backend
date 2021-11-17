let Categorias = require('../models/categorias');

const actualizar_categorias_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){

            // await Categorias.create({
            //     categorias: []
            // });

            let data = req.body;

            let reg = await Categorias.findByIdAndUpdate({_id: "61918cba6bd61d63b5a3a4d6"}, {
                categorias : data.categorias
            });

            res.status(200).send({data: reg});

        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const obtener_categorias_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){

            const id = '61918cba6bd61d63b5a3a4d6';

            let categorias = await Categorias.findById({_id: id});

            res.status(200).send({data: categorias});
            
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

const obtener_categorias_publico = async function (req, res) {
    const id = '61918cba6bd61d63b5a3a4d6';

    let categorias = await Categorias.findById({_id: id});

    res.status(200).send({data: categorias});
}

module.exports = {
    actualizar_categorias_admin,
    obtener_categorias_admin,
    obtener_categorias_publico
}