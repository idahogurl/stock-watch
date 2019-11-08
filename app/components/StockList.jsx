import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import GET_STOCKS from '../graphql/StockList.gql';
import DELETE_STOCK from '../graphql/DeleteStock.gql';

import Stock from './Stock';

const StockList = props => (
  <Mutation
    mutation={DELETE_STOCK}
    update={(cache, { data: { deleteStock } }) => {
            const args = { query: GET_STOCKS };
            const stored = cache.readQuery(args);
            stored.stocks = stored.stocks.filter(c => c.id !== deleteStock.id);
            args.data = stored;
            cache.writeQuery(args);
          }}
  >
    {mutate => (props.stocks.map(s => <Stock key={s.id} {...s} mutate={mutate} />))}
  </Mutation>
);

StockList.propTypes = {
  stocks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
};

export default StockList;
