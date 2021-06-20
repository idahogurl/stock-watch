import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import dayjs from 'dayjs';

import getStocksGql from '../graphql/GetStocks.gql';
import createStockGql from '../graphql/CreateStock.gql'
import deleteStockGql from '../graphql/DeleteStock.gql';
import clientStockGql from '../graphql/ClientStock.gql';

import Container from '../components/Container';
import StockChart from '../components/StockChart';
import StockForm from '../components/StockForm';
import Stock from '../components/Stock';

import onError from '../utils/onError';

window.env = process.env.NODE_ENV;

const GET_STOCKS = gql(getStocksGql + '\n' + clientStockGql);
const CREATE_STOCK = gql(createStockGql);
const DELETE_STOCK = gql(deleteStockGql);

const IndexScreen = function IndexScreen() {
  const loadingStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const { loading, error, data, stopPolling } = useQuery(GET_STOCKS);
  
  const [createStock] = useMutation(CREATE_STOCK);
  const [deleteStock] = useMutation(DELETE_STOCK);

  if (loading) {
    return (
      <Container additionalStyle={loadingStyle}>
        <i className="fa fa-2x fa-spin fa-spinner" />
      </Container>
    );
  }

  if (error) {
    stopPolling();
    onError(error);
    return null;
  }

  const stocks = data.stocks.filter(s => !s._deleted);
  return (
    <Container>
      <div className="d-flex mt-2 align-items-end flex-wrap">
        <div className="flex-grow-1"><img src="./images/logo.svg" alt="Stock Watch Logo" /></div>
        <div>{`From ${dayjs().subtract(3, 'month').format('YYYY-MM-DD')} to ${dayjs().format('MM-DD-YYYY')}`}</div>
      </div>
      <StockChart stocks={stocks} />
      <div className="d-flex flex-wrap">
        {stocks.map((s) => {
          return (<Stock
            key={s.id}
            id={s.id}
            price={s.price}
            company={s.company}
            chart={s.chart}
            deleteStock={deleteStock} />)
        })
        }
        <StockForm createStock={createStock} />
      </div>
    </Container>
  );
};

export default IndexScreen;
