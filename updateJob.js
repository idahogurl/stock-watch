const dayjs = require('dayjs');
const { getStocks } = require('./graphql/stockQuery');
getStocks(dayjs());