module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Stocks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      company: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Stocks'),
};
