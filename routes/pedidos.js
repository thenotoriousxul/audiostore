const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, pedidosController.createPedido);
router.put('/:id/aceptar', verifyToken, pedidosController.aceptarPedido);
router.put('/:id/entregar', verifyToken, pedidosController.entregarPedido);
router.put('/:id/procesar', verifyToken, pedidosController.procesarPedido);
router.put('/:id/revertir', verifyToken, pedidosController.revertirPedido);
router.get('/repartidor', verifyToken, pedidosController.getPedidosRepartidor);

module.exports = router;