module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    company: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'Stocks',
    timestamps: false,
    indexes: [{
      name: 'stock_id_index',
      method: 'BTREE',
      unique: true,
      fields: ['id'],
    },
    ],
  });

  Stock.associate = (models) => {
    Stock.hasMany(models.Price, { foreignKey: 'id', targetKey: 'symbol' });
  };

  return Stock;
};
