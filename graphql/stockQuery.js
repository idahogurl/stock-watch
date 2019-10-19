const axios = require('axios');
const uuid = require('uuid/v4');
const dotenv = require('dotenv');
const { last } = require('lodash');
const { Price, Stock, Sequelize } = require('../db/models');
const dayjs = require('./dayjs-ext');

dotenv.config();

// Get latest data for multiple symbols
const BATCH_STOCK = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=:symbols&interval=5min&apikey=${process.env.ALPHA_VANTAGE_API}`;

function isSame(date1, date2) {
  return date1.isSame(date2, 'year') && date1.isSame(date2, 'month') && date1.isSame(date2, 'date');
}

async function updatePrices(symbols, today) {
  // TODO: This will cause holes in data
  const stockSymbols = symbols.join(',');
  const batchUrl = BATCH_STOCK.replace(':symbols', stockSymbols);

  const { data } = await axios.get(batchUrl);
  console.log(batchUrl);

  const stockData = data['Stock Quotes'];
  const newPrices = stockData.map((s) => {
    const symbol = s['1. symbol'];
    const price = s['2. price'];
    const { 0: date } = s['4. timestamp'].split(' ');
    // do not update if data does not contain today's price
    if (isSame(today, dayjs.utc(date))) {
      const newPrice = {
        id: uuid(),
        symbol,
        x: today.toDate(),
        y: price,
      };
      return newPrice;
    }
    return undefined;
  }).filter((p) => p);

  if (newPrices.length) {
    return Price.bulkCreate(newPrices, {
      return: true,
    });
  }
  return [];
}

async function deleteOldData(date) {
  const from = date.subtract(60, 'day').format('YYYY-MM-DD');
  await Price.destroy({
    where: {
      // SQLite = [Sequelize.Op.and]: Sequelize.literal(`date(x) < ${from}`)
      x: { [Sequelize.Op.lt]: from },
    },
  });
}

async function getStocks(today) {
  await deleteOldData(today);
  const stocks = await Stock.findAll({
    raw: true,
  });

  if (stocks.length > 0) {
    const prices = await Price.findAll({
      order: ['symbol', 'x'],
      raw: true,
    });
    const ids = stocks.map((s) => (s.id));
    // utc conversion pushes back one day
    const lastRecorded = dayjs.utc(last(prices).x).add(1, 'day');

    let stockPrices;
    if (!isSame(today, lastRecorded)) {
      const newPrices = await updatePrices(ids, today);
      stockPrices = prices.concat(newPrices);
    } else {
      stockPrices = prices;
    }

    return { stocks, prices: stockPrices };
  }

  return { stocks: [], prices: [] };
}

module.exports = {
  getStocks,
  isSame,
};
