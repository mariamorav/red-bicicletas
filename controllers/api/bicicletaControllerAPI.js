var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function(req, res){
    Bicicleta.allBicis(function(err, bicicletas){
        res.status(200).json({
            bicicletas: bicicletas
        });
    });
};

exports.bicicleta_create = function(req, res){
    var bici = Bicicleta.createInstance(req.body.id, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng];

    Bicicleta.add(bici);

    res.status(200).json({
        bicicleta: bici
    });
};

exports.bicicleta_update = function(req, res){
    Bicicleta.findOneAndUpdate({"id": req.params.id}, {"code": req.body.id, "color": req.body.color, "modelo": req.body.modelo, "ubicacion": [req.body.lat, req.body.lng]}, function(err, bicicletaUpdate){
        res.status(200).json({
            bicicleta: bicicletaUpdate
        });
    });
};

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeByCode(req.body.code, function(){
        res.status(204).send();
    });
};