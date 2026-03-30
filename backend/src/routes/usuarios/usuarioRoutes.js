const express = require("express");
const router = express.Router();

const usuarioController = require("../../controllers/usuarios/usuarioController");

router.get("/", usuarioController.ListarTodos);
router.get("/:id", usuarioController.buscarPorId);
router.post("/", usuarioController.criarUsuario);
router.put("/:id", usuarioController.atualizarUsuario);
router.delete("/:id", usuarioController.removerUsuario);

module.exports = router;
