import React from 'react';
import { Mutation } from 'react-apollo';

import GET_STOCKS from '../graphql/StockList.gql';
import DELETE_STOCK from '../graphql/DeleteStock.gql';

import Stock from './Stock';

const StockList = ({ stocks }) => (
  <Mutation
    mutation={DELETE_STOCK}
    update={(cache, { data: { deleteStock } }) => {
      const args = { query: GET_STOCKS };
      const stored = cache.readQuery(args);
      stored.stocks = stored.stocks.filter((c) => c.id !== deleteStock.id);
      args.data = stored;
      cache.writeQuery(args);
    }}
  >
    {(mutate) => (stocks.map((s) => (
      <Stock
        key={s.id}
        id={s.id}
        price={s.price}
        company={s.company}
        chart={s.chart}
        mutate={mutate}
      />
    )))}
  </Mutation>
);

export default StockList;
