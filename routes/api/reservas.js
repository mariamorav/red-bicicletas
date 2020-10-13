const express = require("express");
const router = express.Router();
const reservasController = require("../../controllers/api/reservasControllerAPI");

router.get("/", reservasController.reservas_list);
router.delete("/removeAll", reservasController.remove_all);

module.exports = router;
