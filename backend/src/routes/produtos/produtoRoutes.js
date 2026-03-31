const express = require("express");
const router = express.Router();

const produtoController = require("../../controllers/produtos/produtosController");

router.get("/", produtoController.obterTodos);
router.get("/:id", produtoController.buscarPorId);
router.post("/", produtoController.criar);
router.put("/:id", produtoController.atualizar);
router.delete("/:id", produtoController.remover);

module.exports = router;