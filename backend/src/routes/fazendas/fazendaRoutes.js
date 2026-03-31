const express = require("express");
const router = express.Router();

const fazendaController = require('../../controllers/fazendas/fazendaController.js');

router.get("/", fazendaController.ListasTodas);
router.get("/:id", fazendaController.ListarPorId);
router.post("/", fazendaController.CriarFazenda);
router.put("/:id", fazendaController.AtualizarFazenda);
router.delete("/:id", fazendaController.RemoverFazenda);

module.exports = router;