const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("./config/passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const jwt = require("jsonwebtoken");

const indexRouter = require("./routes/index");
const usuariosRouter = require("./routes/usuarios");
const tokenRouter = require("./routes/token");
const bicicletasRouter = require("./routes/bicicletas");

const sessionRouter = require("./routes/session/login");
const sessionAPIRouter = require("./routes/api/session");

const authAPIRouter = require("./routes/api/auth");
const bicicletasAPIRouter = require("./routes/api/bicicletas");
const usuariosAPIRouter = require("./routes/api/usuarios.js");
const reservasAPIRouter = require("./routes/api/reservas.js");

let store;

if (process.env.NODE_ENV === "dev") {
    store = new session.MemoryStore();
} else {
    store = new MongoDBStore({
        uri: process.env.MONGO_URI,
        collection: "sessions",
    });

    store.on("error", function (error) {
        assert.ifError(error);
        assert.ok(false);
    });
}

const app = express();

app.set("secretKey", "jwt_pwd_11223344");

app.use(
    session({
        cookie: { maxAge: 240 * 60 * 60 * 1000 },
        store: store,
        saveUninitialized: true,
        resave: "true",
        secret: "asP23faqwrDRqasd23qQWE3fdsE",
    })
);

let mongoose = require("mongoose");
const { assert } = require("console");
let mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB connection error: "));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/usuarios", usuariosRouter);
app.use("/token", tokenRouter);
app.use("/bicicletas", loggedIn, bicicletasRouter);
app.use("/session", sessionRouter);

app.use("/api/session", sessionAPIRouter);
app.use("/api/auth", authAPIRouter);
app.use("/api/bicicletas", validarUsuario, bicicletasAPIRouter);
app.use("/api/usuarios", usuariosAPIRouter);
app.use("/api/reservas", reservasAPIRouter);

app.use("/privacy_policy", function (req, res) {
    res.sendFile("public/politica_privacidad.html");
});

app.use("/google37d0834a85dac0dd", function (req, res) {
    res.sendFile("public/google37d0834a85dac0dd.html");
});

app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/plus.profile.emails.read",
        ],
    })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/");
    }
);


/* app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/error',
  })
);
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "dev" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

function loggedIn(req, res, next) {
    if (req.usuario) {
        next();
    } else {
        console.log("Usuario sin loggearse.");
        res.redirect("/session/login");
    }
}

function validarUsuario(req, res, next) {
    jwt.verify(
        req.headers["x-access-token"],
        req.app.get("secretKey"),
        function (err, decoded) {
            if (err) {
                res.json({ status: "error", message: err.message, data: null });
            } else {
                req.body.userID = decoded.id;

                console.log("JWT verify: " + decoded);

                next();
            }
        }
    );
}

module.exports = app;
