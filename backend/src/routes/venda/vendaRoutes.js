const express = require('express');
const router = express.Router();
const vendaController = require('../../controllers/vendas/vendaController');

const { ListarTodos, buscarPorId, criarVenda } = vendaController;

router.get('/', ListarTodos);
router.get('/:id', buscarPorId);
router.post('/', criarVenda);
router.put('/:id', vendaController.atualizarVenda);
router.delete('/:id', vendaController.deletarVenda);

module.exports = router;