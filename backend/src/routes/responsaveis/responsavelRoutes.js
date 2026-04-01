const express = require('express');
const router = express.Router();
const responsavelController = require('../../controllers/responsaveis/responsavelController.js');

router.get('/', responsavelController.listarTodos);
router.get('/fazenda/:fazenda_id', responsavelController.listarPorFazenda);
router.get('/:id', responsavelController.buscarPorId);
router.post('/', responsavelController.criar);
router.put('/:id', responsavelController.atualizar);
router.delete('/:id', responsavelController.remover);

module.exports = router;
