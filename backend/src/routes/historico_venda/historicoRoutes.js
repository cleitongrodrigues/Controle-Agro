const express = require('express');
const router = express.Router();
const clienteController = require('../../controllers/clientes/clienteController.js');

router.get('/', clienteController.listarTodos);

module.exports = router;