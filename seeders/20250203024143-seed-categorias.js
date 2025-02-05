'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categorias', [
      { nombre: 'Audífonos Inalámbricos', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Audífonos con Cable', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Auriculares Deportivos', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Auriculares de Estudio', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Auriculares Gaming', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categorias', null, {});
  }
};
