const GraphQLToolTypes = require('graphql-tools-types');
const Axios = require('axios');
const { isEmpty } = require('lodash');
const dotenv = require('dotenv');
const { Stock } = require('../db/models');

dotenv.config();
const SRV_URL = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=:symbols&types=quote,company,chart&range=3m&token=${process.env.IEXCLOUD_SECRET}`;

const resolvers = {
  UUID: GraphQLToolTypes.UUID({ name: 'UUID', storage: 'string' }),
  JSON: GraphQLToolTypes.JSON({ name: 'JSON' }),
  Date: GraphQLToolTypes.Date({ name: 'Date' }),
  Void: GraphQLToolTypes.Void({ name: 'Void' }),
  Mutation: {
    async createStock(_, { id }) {
      const url = SRV_URL.replace(':symbols', id);
      const { data: stockData } = await Axios.get(url);
      const { quote, chart } = stockData[id] || {};
      
      if (isEmpty(quote) || isEmpty(chart)) {
        throw new Error('Invalid symbol');
      }

      const result = await Stock.findCreateFind({
        where: { id },
        defaults: { id },
        raw: true,
      });

      if (result[1]) { // new stock created
        const { quote, company: { companyName }, chart } = stockData[id];
        const chartData = chart.map((c) => ({ x: new Date(c.date), y: c.close }));

        const stock = {
          id,
          price: quote.latestPrice,
          company: companyName,
          chart: chartData,
        };

        return stock;
      }
      throw new Error('Symbol already exists');
    },
    async deleteStock(_, { id }) {
      await Stock.destroy({ where: { id } });

      return { id };
    },
  },
  Query: {
    async stocks() {
      const stocks = await Stock.findAll({ raw: true });
      
      if (stocks.length) {
        const symbols = stocks.map((s) => s.id).join(',');
        const url = SRV_URL.replace(':symbols', symbols);
        
        const { data: stockData } = await Axios.get(url);
      
        const results = Object.keys(stockData).map((s) => {
          const { company: { companyName }, quote, chart } = stockData[s];
          const chartData = chart.map((c) => ({ x: new Date(c.date), y: c.close }));
          return {
            id: s,
            price: quote.latestPrice,
            company: companyName,
            chart: chartData,
          };
        });

        return results;
      }
      return [];
    },
  },
};

module.exports = resolvers;
