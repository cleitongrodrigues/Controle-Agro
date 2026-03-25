const express = require("express");
const router = express.Router();

const usuarioController = require("../../controllers/usuarios/usuarioController");

router.get("/", usuarioController.getAll);

module.exports = router;