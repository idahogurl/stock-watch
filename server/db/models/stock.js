module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    symbol: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'stocks',
    timestamps: false,
    indexes: [{
      name: 'stock_symbol_index',
      method: 'BTREE',
      unique: true,
      fields: ['symbol'],
    },
    ],
  });
  return Stock;
};
