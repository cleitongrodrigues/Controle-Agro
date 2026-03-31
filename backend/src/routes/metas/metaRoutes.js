const express = require('express');
const router = express.Router();
const metasController = require('../../controllers/metas/metasController.js');

router.get('/', metasController.listarTodos);
router.get('/:id', metasController.buscarPorId);
router.post('/', metasController.criarMeta);
router.put('/:id', metasController.atualizarMeta);
router.delete('/:id', metasController.deletarMeta);

module.exports = router;