import React from 'react';
import { Query } from 'react-apollo';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';

import GET_STOCKS from '../graphql/StockList.gql';

import Container from '../components/Container';
import StockList from '../components/StockList';
import StockChart from '../components/StockChart';
import StockForm from '../components/StockForm';

import onError from '../utils/onError';

const IndexScreen = function IndexScreen() {
  const loadingStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  return (
    <Query query={GET_STOCKS} pollInterval={30000}>
      {({
          loading, error, data, stopPolling,
        }) => {
        if (loading) {
          return (
            <Container additionalStyle={loadingStyle}>
              <i className="fa fa-2x fa-spin fa-spinner" />
            </Container>
            );
        }

        if (error) {
          stopPolling();
          onError(error || this.state.error);
          return null;
        }

        const { stocks } = data;
        return (
          <Container>
            <div className="d-flex mt-2 align-items-end">
              <div className="flex-grow-1"><img src="./images/logo.svg" alt="Stock Watch Logo" /></div>
              <div>From {dayjs().subtract(3, 'month').format('MM-DD-YYYY')} to {dayjs().format('MM-DD-YYYY')} </div>
            </div>
            <StockChart stocks={stocks} />
            <div className="d-flex flex-wrap">
              <StockList stocks={uniqBy(stocks, 'symbol')} />
              <StockForm />
            </div>
          </Container>);
      }}
    </Query>
  );
};

export default IndexScreen;
