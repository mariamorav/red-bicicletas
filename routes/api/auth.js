const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/api/authControllerAPI");
const Passport = require("../../config/passport");

router.post("/authenticate", AuthController.authenticate);
router.post("/forgotPassword", AuthController.forgotPassword);
router.post(
    "/facebook_token",
    Passport.authenticate("facebook-token"),
    AuthController.authFacebookToken
);

module.exports = router;
