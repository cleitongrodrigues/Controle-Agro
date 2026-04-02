const express = require('express');
const router = express.Router();
const pedidoController = require('../../controllers/pedidos/pedidoController');

router.get('/', pedidoController.listarTodos);
router.get('/:id', pedidoController.buscarPorId);
router.post('/', pedidoController.criarPedido);
router.put('/:id', pedidoController.atualizarPedido);
router.delete('/:id', pedidoController.deletarPedido);

module.exports = router;
