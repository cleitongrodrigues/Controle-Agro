const express = require("express");
const router = express.Router();

const usuarioController = require("../../controllers/usuarios/usuarioController");

router.get("/", usuarioController.obterTodos);
router.get("/:id", usuarioController.buscarPorId);
router.post("/", usuarioController.criar);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.remover);

module.exports = router;
