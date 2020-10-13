const mongoose = require("mongoose");
const Reserva = require("./reserva");
const Token = require("../models/token");
const mailer = require("../mailer/mailer");

const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const Schema = mongoose.Schema;

const validateEmail = function (email) {
    const re = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    return re.test(email);
};

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, "El nombre es obligatorio"],
    },
    email: {
        type: String,
        trim: true,
        required: [true, "El email es obligatorio"],
        lowercase: true,
        unique: true,
        validate: [validateEmail, "Por favor, ingrese un email valido"],
        match: [/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i],
    },
    password: {
        type: String,
        required: [true, "El password es obligatorio"],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false,
    },
    googleId: String,
    facebookId: String
});

usuarioSchema.plugin(uniqueValidator, {
    message: "El {PATH} ya existe con otro usuario",
});

usuarioSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
    var reserva = new Reserva({
        usuario: this._id,
        bicicleta: biciId,
        desde: desde,
        hasta: hasta,
    });
    console.log(reserva);
    reserva.save(cb);
};

//metodos para el manejo de mails

usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
    const token = new Token({
        _userId: this.id,
        token: crypto.randomBytes(16).toString("hex"),
    });
    const email_destination = this.email;
    token.save(function (err) {
        if (err) {
            return console.log(err.message);
        }

        const mailOptions = {
            from: "no-reply@redBicicletas.com",
            to: email_destination,
            subject: "Bienvenido/a",
            text:
                "Hola, \n\n" +
                "Por favor haz click en el siguiente enlace para verificar tu cuenta. \n" +
                `http://localhost:5000` +
                "/token/confirm/" +
                token.token +
                "\n",
        };

        mailer.sendMail(mailOptions, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(
                "A verification mail has been sent to " +
                    email_destination +
                    "."
            );
        });
    });
};

usuarioSchema.methods.resetPassword = function (cb) {
    const token = new Token({
        _userId: this.id,
        token: crypto.randomBytes(16).toString("hex"),
    });
    const email_destination = this.email;
    token.save(function (err) {
        if (err) {
            return cb(err);
        }
        const mailOptions = {
            from: "no-reply@redBicicletas.com",
            to: email_destination,
            subject: "Reseteo del password de tu cuenta",
            text:
                "Hola,\n\n" +
                "Por favor, para resetear el password de su cuenta haga click en el sigueinte link:\n" +
                "http://localhost:5000" +
                "/resetPassword/" +
                token.token,
        };

        mailer.sendMail(mailOptions, function (err) {
            if (err) {
                return cb(err);
            }
            console.log(
                "Se envio un email para resetear el password a: " +
                    email_destination +
                    "."
            );
        });

        cb(null);
    });
};

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(
    condition,
    callback
) {
    const self = this;
    console.log(condition);
    self.findOne({
        $or: [{ googleId: condition.id }, { email: condition.emails[0].value }],
    }),
        (err, result) => {
            if (result) {
                callback(err, result);
            } else {
                console.log(":::: Condition ::::: ");
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || "Sin nombre";
                values.verificado = true;
                values.password = condition._json.etag;
                console.log(":::: Values ::::");
                console.log(values);
                self.create(values, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return callback(err, result);
                });
            }
        };
};

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreateByFacebook(
    condition,
    callback
) {
    const self = this;
    console.log("condition", condition);
    self.findOne(
        {
            $or: [
                { facebookId: condition.id },
                { email: condition.emails[0].value },
            ],
        },
        (err, result) => {
            if (result) {
                callback(err, result);
            } else {
                console.log("--------- Condition ------------");
                console.log("condition", condition);
                let values = {};
                values.facebookId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || "Sin nombre";
                values.validated = true;
                values.password = crypto.randomBytes(16).toString("hex");
                console.log("--------- Values --------------");
                console.log("values", values);
                self.create(values, (err, result) => {
                    if (err) {
                        console.log("err", err);
                    }
                    return callback(err, result);
                });
            }
        }
    );
};

module.exports = mongoose.model("Usuario", usuarioSchema);
