var Cupon = require('../models/cupon');

const registro_cupon_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){

            let data = req.body;

            let cupon = await Cupon.create(data);

            res.status(200).send({data: cupon});
        }else{
            res.status(500).send({message: 'UnauthorizedAccess'});
        }
    }else{
        res.status(500).send({message: 'UnauthorizedAccess'});
    }
}

module.exports = {
    registro_cupon_admin
}