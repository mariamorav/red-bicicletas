var express = require("express");
const Token = require("../../models/token");
const Usuario = require("../../models/usuario");
var router = express.Router();

//Views -- Start
router.get("/login", (req, res) => {
    res.render("session/login");
});

router.get("/forgotPassword", (req, res) => {
    res.render("session/forgotPassword");
});

router.get("/forgotPassword/:token", (req, res, next) => {
    Token.findOne(
        {
            token: req.params.token,
        },
        (err, token) => {
            if (!token)
                return res.status(400).send({
                    type: "not-verified",
                    msg:
                        "No existe un usuario asociado al token. \n" +
                        "Verifique que su token no haya expirado.",
                });

            Usuario.findById(token._userId, (err, usuario) => {
                if (!usuario)
                    return res
                        .status(400)
                        .send({ msg: "No existe usuario asociado al token." });
                res.render("session/resetPassword", { errors: {}, usuario });
            });
        }
    );
});

router.get("/logout", (req, res) => {
    res.redirect("/");
});

module.exports = router;
