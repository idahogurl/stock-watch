
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Stocks', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    symbol: {
      type: Sequelize.STRING,
    })

    queryInterface.addIndex('stocks', {
        name: 'stock_symbol_index',
        method: 'BTREE',
        fields: ['symbol'],
        unique: true,
    },
  down: queryInterface => queryInterface.dropTable('Stocks'),
};
