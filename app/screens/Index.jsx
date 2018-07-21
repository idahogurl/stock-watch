import React, { Fragment } from 'react';
import { Query, Subscription } from 'react-apollo';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';

import GET_STOCKS from '../graphql/StockList.gql';
import STOCK_DELETED from '../graphql/StockDeleted.gql';
import STOCK_ADDED from '../graphql/StockAdded.gql';

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
    <Query query={GET_STOCKS}>
      {({
          loading, error, data,
        }) => {
        if (loading) {
          return (
            <Container additionalStyle={loadingStyle}>
              <i className="fa fa-2x fa-spin fa-spinner" />
            </Container>
            );
        }

        if (error) {
          onError(error || this.state.error);
          return null;
        }

        return (
          <Container>
            <div className="d-flex mt-2 align-items-end">
              <div className="flex-grow-1"><img src="./images/logo.svg" alt="Stock Watch Logo" /></div>
              <div>From {dayjs().subtract(3, 'month').format('MM-DD-YYYY')} to {dayjs().format('MM-DD-YYYY')} </div>
            </div>
            <Subscription subscription={STOCK_DELETED}>
              {({ data: deletedData, loading: deleteLoading }) => {
              /*
                Get all stocks when loading or undefined deletedData OR
                Get stocks not equal to the deleted stock
              */
              const stocks = data.stocks.filter(s =>
                  deleteLoading || deletedData === undefined || s.id !== deletedData.stockDeleted);

                return (
                  <Subscription subscription={STOCK_ADDED}>
                    {({ data: addData, loading: addLoading }) => {
                    // To avoid duplicates, filter out the added stock if it exists
                    if (!addLoading && addData !== undefined) {
                      console.log('addLoading', addLoading);
                      console.log('addData', addData);
                      stocks.push(addData.stockAdded);
                      console.log(stocks);
                    }

                    return (
                      <Fragment>
                        <StockChart stocks={stocks} />
                        <div className="d-flex flex-wrap">
                          <StockList stocks={uniqBy(stocks, 'symbol')} />
                          <StockForm />
                        </div>
                      </Fragment>);
                    }}
                  </Subscription>);
            }}
            </Subscription>
          </Container>);
      }
    }
    </Query>
  );
};

export default IndexScreen;
