import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import dayjs from 'dayjs';

import GET_STOCKS from '../graphql/StockList.gql';
import DELETE_STOCK from '../graphql/DeleteStock.gql';

import StockChart from '../components/StockChart';
import Stock from '../components/Stock';
import StockForm from '../components/StockForm';

import onError from '../utils/onError';

class IndexScreen extends Component {
  render() {
    return (
      <Query query={GET_STOCKS} pollInterval={0}>
        {({
          loading, error, data, stopPolling,
        }) => {
        if (loading) {
          return <i className="fa fa-2x fa-spin fa-spinner" />;
        }

        if (error) {
          onError(error || this.state.error);
          stopPolling();
          return null;
        }

        return (
          <div className="container">
            <p>From {dayjs().subtract(3, 'month').format('MM-DD-YYYY')} to {dayjs().format('MM-DD-YYYY')} </p>
            <StockChart stocks={data.stocks} />
            <div className="d-flex flex-wrap">
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
                {mutate => data.stocks.map(s =>
                  <Stock key={s.id} {...s} mutate={mutate} />)
              }
              </Mutation>
              <StockForm />
            </div>
          </div>);
      }
    }
      </Query>
    );
  }
}

export default IndexScreen;
