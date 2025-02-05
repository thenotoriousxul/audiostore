'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Productos', [
      { nombre: 'Sony WH-1000XM5', descripcion: 'Audífonos inalámbricos con cancelación de ruido', stock: 10, stock_minimo: 2, precio: 6500, categoriaId: 5, imagepath: 'https://m.media-amazon.com/images/I/511c23mDjoL.AC_SL1500.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Bose QuietComfort 45', descripcion: 'Audífonos inalámbricos con cancelación activa de ruido', stock: 8, stock_minimo: 2, precio: 7000, categoriaId: 5, imagepath: 'https://m.media-amazon.com/images/I/51QeS0jkx-L._AC_SX300_SY300_QL70_ML2.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'JBL Live 660NC', descripcion: 'Audífonos inalámbricos con cancelación activa de ruido', stock: 15, stock_minimo: 3, precio: 3500, categoriaId: 5, imagepath: 'https://m.media-amazon.com/images/I/61cjF3Y4pwL._AC_SX300_SY300_QL70_ML2.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Apple AirPods Pro 2', descripcion: 'Auriculares inalámbricos con cancelación activa de ruido', stock: 20, stock_minimo: 5, precio: 5500, categoriaId: 5, imagepath: 'https://m.media-amazon.com/images/I/41IcucOVbcL.AC_SL1000.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Sennheiser Momentum 4', descripcion: 'Audífonos de alta calidad con cancelación de ruido', stock: 7, stock_minimo: 2, precio: 8000, categoriaId: 5, imagepath: 'https://m.media-amazon.com/images/I/716++4xC2wL.AC_SY300_SX300.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Beats Studio3 Wireless', descripcion: 'Audífonos inalámbricos con cancelación activa de ruido', stock: 5, stock_minimo: 1, precio: 9500, categoriaId: 5, imagepath: 'https://m.media-amazon.com/images/I/61QYYjm4KhL.AC_SL1500.jpg', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Productos', null, {});
  }
};
