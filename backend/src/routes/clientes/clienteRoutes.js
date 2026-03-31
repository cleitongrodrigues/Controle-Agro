const express = require('express');
const router = express.Router();
const clienteController = require('../../controllers/clientes/clienteController.js');

router.get('/', clienteController.listarTodos);
router.get('/:id', clienteController.buscarPorId);
router.post('/', clienteController.criarCliente);
router.put('/:id', clienteController.atualizarCliente);
router.delete('/:id', clienteController.deletarCliente);

module.exports = router;