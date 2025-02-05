const { Pedidos, DetallesDePedido, sequelize } = require('../models');

exports.getPedidosRepartidor = async (req, res) => {
  try {
    console.log('User ID:', req.userId); // Log para verificar el userId
    const pedidos = await Pedidos.findAll({
      where: {
        estado_envio: ['En Proceso', 'En Camino', 'Entregado'],
        ...(req.userId && { repartidorId: req.userId })
      },
      include: [{ model: DetallesDePedido, as: 'detalles' }]
    });

    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error fetching pedidos:', error); // Log para verificar el error
    res.status(500).json({ error: error.message });
  }
};

exports.createPedido = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { direccion, estado_envio, estado_pago, forma_pagoId, detalles } = req.body;
    const pedido = await Pedidos.create({
      fecha_realizacion: new Date(),
      clienteId: req.userId,
      direccion,
      estado_envio,
      estado_pago,
      forma_pagoId
    }, { transaction: t });

    for (const detalle of detalles) {
      await DetallesDePedido.create({
        pedidoId: pedido.id,
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precio: detalle.precio
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(pedido);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.aceptarPedido = async (req, res) => {
  console.log('Solicitud para aceptar pedido recibida');
  try {
    const pedido = await Pedidos.findByPk(req.params.id);
    if (!pedido) {
      console.log('Pedido no encontrado');
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (pedido.estado_envio !== 'En Proceso') {
      return res.status(400).json({ message: 'El pedido no está en estado En Proceso' });
    }

    pedido.repartidorId = req.body.repartidorId;
    pedido.estado_envio = 'En Camino';
    await pedido.save();

    console.log('Pedido aceptado:', pedido);
    res.status(200).json(pedido);
  } catch (error) {
    console.log('Error al aceptar pedido:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.entregarPedido = async (req, res) => {
  console.log('Solicitud para entregar pedido recibida');
  try {
    const pedido = await Pedidos.findByPk(req.params.id);
    if (!pedido) {
      console.log('Pedido no encontrado');
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (pedido.estado_envio !== 'En Camino') {
      return res.status(400).json({ message: 'El pedido no está en estado En Camino' });
    }

    pedido.estado_envio = 'Entregado';
    pedido.fecha_entrega = new Date();
    await pedido.save();

    console.log('Pedido entregado:', pedido);
    res.status(200).json(pedido);
  } catch (error) {
    console.log('Error al entregar pedido:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.procesarPedido = async (req, res) => {
  console.log('Solicitud para procesar pedido recibida');
  try {
    const pedido = await Pedidos.findByPk(req.params.id);
    if (!pedido) {
      console.log('Pedido no encontrado');
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (pedido.estado_envio !== 'Pendiente') {
      return res.status(400).json({ message: 'El pedido no está en estado Pendiente' });
    }

    pedido.estado_envio = 'En Proceso';
    await pedido.save();

    console.log('Pedido en proceso:', pedido);
    res.status(200).json(pedido);
  } catch (error) {
    console.log('Error al procesar pedido:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.revertirPedido = async (req, res) => {
  console.log('Solicitud para revertir pedido recibida');
  try {
    const pedido = await Pedidos.findByPk(req.params.id);
    if (!pedido) {
      console.log('Pedido no encontrado');
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (pedido.estado_envio !== 'En Camino') {
      return res.status(400).json({ message: 'El pedido no está en estado En Camino' });
    }

    pedido.estado_envio = 'Pendiente';
    await pedido.save();

    console.log('Pedido revertido a Pendiente:', pedido);
    res.status(200).json(pedido);
  } catch (error) {
    console.log('Error al revertir pedido:', error);
    res.status(400).json({ error: error.message });
  }
};