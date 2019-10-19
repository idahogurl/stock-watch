module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define('Price', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    symbol: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    x: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    y: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
  }, {
    tableName: 'Prices',
    timestamps: false,
    indexes: [{
      name: 'price_symbol_x_index',
      method: 'BTREE',
      unique: true,
      fields: ['symbol', 'x'],
    },
    ],
  });

  Price.associate = (models) => {
    Price.belongsTo(models.Stock, { foreignKey: 'symbol', targetKey: 'id' });
  };

  return Price;
};
