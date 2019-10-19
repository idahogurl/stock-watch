import GraphQLToolTypes from 'graphql-tools-types';
import uuid from 'uuid/v4';
import Axios from 'axios';
import dotenv from 'dotenv';
import {
  groupBy, isEmpty, round,
} from 'lodash';
import dayjs from './dayjs-ext';
import {
  sequelize, Stock, Price,
} from '../db/models';
import { isSame, getStocks } from './stockQuery';

dotenv.config();

// Get today's and few months of data for one symbol
const TIME_SERIES = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=:symbol&apikey=${process.env.ALPHA_VANTAGE_API}`;

// Get company info
const SYMBOL_SEARCH = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=:symbol&apikey=${process.env.ALPHA_VANTAGE_API}`;

const CLOSE_PRICE_KEY = '4. close';

function insert(theArray, index, item) {
  theArray.splice(index, 0, item);
}

function fillGaps(today, prices) {
  let previousDay = today;
  let previousStock = { ...prices[0] };

  for (let index = 0; index < 60; index += 1) {
    const stockPrice = prices[index];
    if (!stockPrice || !isSame(dayjs.utc(stockPrice.x), previousDay)) {
      previousStock.id = uuid();
      previousStock.x = previousDay.toDate();
      insert(prices, index, previousStock);
    }
    previousStock = { ...prices[index] };
    previousDay = previousDay.subtract(1, 'day');
  }
}

function isAfter(date1, date2) {
  return date1.isAfter(date2, 'year') || date1.isAfter(date2, 'month') || date1.isAfter(date2, 'date');
}

export default {
  UUID: GraphQLToolTypes.UUID({ name: 'UUID', storage: 'string' }),
  JSON: GraphQLToolTypes.JSON({ name: 'JSON' }),
  Date: GraphQLToolTypes.Date({ name: 'Date' }),
  Void: GraphQLToolTypes.Void({ name: 'Void' }),
  Mutation: {
    async createStock(_, { id }) {
      const timeSeriesUrl = TIME_SERIES.replace(':symbol', id);
      const { data: timeSeries } = await Axios.get(timeSeriesUrl);
      const stockData = timeSeries['Time Series (Daily)'];
      if (isEmpty(stockData)) {
        throw new Error('Invalid symbol');
      }

      const symbolSearchUrl = SYMBOL_SEARCH.replace(':symbol', id);
      const { data: symbols } = await Axios.get(symbolSearchUrl);

      let company = 'Unavailable';
      if (symbols.bestMatches.length) {
        const { 0: first } = symbols.bestMatches;
        company = first['2. name'];
      }

      const stock = await sequelize.transaction(async (t) => {
        const result = await Stock.findCreateFind({
          where: { id },
          defaults: { id, company },
          raw: true,
        }, { transaction: t });

        const created = result[1];
        if (created) {
          const today = dayjs.utc(dayjs().format('YYYY-MM-DD'));
          const start = today.subtract(61, 'day');
          // filter out data older than 60 days
          const days = Object.keys(stockData).filter((d) => {
            const day = dayjs.utc(d);
            return isAfter(day, start) || isSame(day, start);
          });

          // save all the prices
          const chartData = days.map((day) => ({
            id: uuid(),
            symbol: id,
            x: dayjs.utc(day).toDate(),
            y: round(stockData[day][CLOSE_PRICE_KEY], 2),
          }));

          fillGaps(today, chartData);
          await Price.bulkCreate(chartData, { transaction: t });

          const { y } = chartData[0];
          const createStock = {
            id,
            company,
            price: y,
            chart: chartData.map(({ xVal, yVal }) => ({ x: dayjs.utc(xVal), y: yVal })),
          };

          return createStock;
        }
        throw new Error('Symbol already exists');
      });
      return stock;
    },
    async deleteStock(_, { id }) {
      await sequelize.transaction(async (t) => {
        await Price.destroy({ where: { symbol: id } }, { transaction: t });
        await Stock.destroy({ where: { id } }, { transaction: t });
      });
      return id;
    },
  },
  Query: {
    async stocks() {
      const today = dayjs.utc(dayjs().format('YYYY-MM-DD'));
      const { stocks, prices } = await getStocks(today);
      const pricesByStockId = groupBy(prices, (p) => (p.symbol));
      const stockList = stocks.map(({ id, company }) => {
        const { 0: { y: todaysPrice } } = pricesByStockId[id];
        return {
          id,
          company,
          price: todaysPrice,
          chart: pricesByStockId[id].map(({ x, y }) => ({ x: dayjs.utc(x).add(1, 'day').toDate(), y: round(y, 2) })),
        };
      }).filter((s) => s);
      return stockList;
    },
  },
};
