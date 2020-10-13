var Reserva = require("../../models/reserva");

exports.reservas_list = async (req, res) => {
    res.status(200).json({
        reservas: await Reserva.allReservas(),
    });
};

exports.remove_all = async (req, res) => {
    res.status(200).json({
        reservas: await Reserva.removeAll(),
    });
};
