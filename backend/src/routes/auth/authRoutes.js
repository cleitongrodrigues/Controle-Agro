const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');

router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
