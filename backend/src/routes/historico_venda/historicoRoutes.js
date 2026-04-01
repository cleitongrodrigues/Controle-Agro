const express = require('express');
const router = express.Router();
const historicoController = require('../../controllers/historico_venda/historicoController.js');

router.get('/', historicoController.listarHistorico);

module.exports = router;