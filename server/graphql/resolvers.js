import GraphQLToolTypes from 'graphql-tools-types';
import { PubSub } from 'graphql-subscriptions';
import UUID from 'uuid/v4';
import Axios from 'axios';
import { keyBy, isEmpty } from 'lodash';
import { Stock } from '../db/models';

const SRV_URL = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=:symbols&types=price,company,chart&range=3m';

const pubsub = new PubSub();

export default {
  UUID: GraphQLToolTypes.UUID({ name: 'UUID', storage: 'string' }),
  JSON: GraphQLToolTypes.JSON({ name: 'JSON' }),
  Date: GraphQLToolTypes.Date({ name: 'Date' }),
  Void: GraphQLToolTypes.Void({ name: 'Void' }),
  Mutation: {
    async createStock(_, { symbol }) {
      const { data: stockData } = await Axios.get(SRV_URL.replace(':symbols', symbol));

      if (isEmpty(stockData)) {
        throw new Error('Invalid symbol');
      }

      const id = UUID();
      const result = await Stock.findCreateFind({
        where: { symbol },
        defaults: { id, symbol },
        raw: true,
      });

      if (result[1]) { // new stock created
        const { price, company: { companyName }, chart } = stockData[symbol];
        const chartData = chart.map(c => ({ x: new Date(c.date), y: c.close }));

        const stock = {
          id,
          symbol,
          price,
          company: companyName,
          chart: chartData,
        };

        pubsub.publish('stockAdded', { stockAdded: stock });

        return stock;
      }
      throw new Error('Symbol already exists');
    },
    async deleteStock(_, { id }) {
      await Stock.destroy({ where: { id } });

      pubsub.publish('stockDeleted', { stockDeleted: id });

      return { id };
    },
  },
  Query: {
    async stocks() {
      const stocks = await Stock.findAll({ raw: true });
      const stocksBySymbol = keyBy(stocks, 'symbol');

      const symbols = Object.keys(stocksBySymbol).join(',');
      const { data: stockData } = await Axios.get(SRV_URL.replace(':symbols', symbols));

      const results = Object.keys(stockData).map((s) => {
        const { company: { companyName }, price, chart } = stockData[s];
        const chartData = chart.map(c => ({ x: new Date(c.date), y: c.close }));

        return Object.assign({
          price,
          company: companyName,
          chart: chartData,
        }, stocksBySymbol[s]);
      });

      return results;
    },
  },
  Subscription: {
    stockAdded: {
      subscribe: () => pubsub.asyncIterator('stockAdded'),
    },
    stockDeleted: {
      subscribe: () => pubsub.asyncIterator('stockDeleted'),
    },
  },
};
