module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stocks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Stocks'),
};
