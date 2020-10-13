const Passport = require("../../config/passport");
const express = require("express");
const router = express.Router();
const Usuario = require("../../models/usuario");

//Session endpoints
router.post("/login", (req, res, next) => {
    Passport.authenticate("local", (err, usuario, info) => {
        console.log("err, usuario, info", err, usuario, info);
        if (err) return next(err);
        if (!usuario) return res.render("/login", { info });
        req.login(usuario, (err) => {
            if (err) return next(err);
            return res.redirect("/");
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.post("/forgotPassword", (req, res, next) => {
    Usuario.findOne({ email: req.body.email }, (err, usuario) => {
        if (!usuario)
            return res.render("/forgotPassword", {
                info: { message: "No existe un usuario con ese email" },
            });

        usuario.resetpassword((err) => {
            if (err) return next(err);
            console.log("/forgotPasswordMessage");
        });

        res.render("/forgotPasswordMessage");
    });
});

router.post("/resetPassword", (req, res, next) => {
    if (req.body.password != req.body.confirm_password) {
        res.render("/resetPassword", {
            errors: {
                confirm_password: {
                    message: "No coincide con la contraseña ingresada.",
                },
            },
            usuario: new Usuario({ email: req.body.email }),
        });
        return;
    }

    Usuario.findOne({ email: req.body.email }, (err, usuario) => {
        usuario.password = req.body.password;
        usuario.save((err) => {
            if (err) {
                res.render("/resetPassword", {
                    errors: err.errors,
                    usuario: new Usuario({ email: req.body.email }),
                });
            } else {
                res.redirect("/login");
            }
        });
    });
});

module.exports = router;
