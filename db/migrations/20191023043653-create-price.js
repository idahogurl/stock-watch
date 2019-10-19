module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Prices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      symbol: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Stocks',
          key: 'id',
        },
      },
      x: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      y: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
    });

    await queryInterface.addIndex('Prices', {
      name: 'price_symbol_x_index',
      method: 'BTREE',
      fields: ['symbol', 'x'],
      unique: true,
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Prices'),
};
