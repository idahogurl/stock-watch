module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
  },

  {
    tableName: 'stocks',
    timestamps: false,
  });

  return Stock;
};
