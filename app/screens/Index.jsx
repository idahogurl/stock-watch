import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import gql from "graphql-tag";

import getStocksGql from '../graphql/GetStocks.gql';
import createStockGql from '../graphql/CreateStock.gql'
import deleteStockGql from '../graphql/DeleteStock.gql';
import newStockGql from '../graphql/NewStock.gql';

import Container from '../components/Container';
import StockChart from '../components/StockChart';
import StockForm from '../components/StockForm';
import Stock from '../components/Stock';

import onError from '../utils/onError';

window.env = process.env.NODE_ENV;

const GET_STOCKS = gql(getStocksGql);
const CREATE_STOCK = gql(createStockGql);
const NEW_STOCK = gql(newStockGql);
const DELETE_STOCK = gql(deleteStockGql);

const IndexScreen = function IndexScreen() {
  const loadingStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const { loading, error, data, stopPolling } = useQuery(GET_STOCKS);

  const [createStock] = useMutation(CREATE_STOCK, {
    update(cache, { data: { createStock } }) {
      cache.modify({
        fields: {
          stocks(existingStockRefs = [], { readField }) {
            const newStockRef = cache.writeFragment({
              data: createStock,
              fragment: NEW_STOCK
            });
      
            // Quick safety check - if the new stock is already
            // present in the cache, we don't need to add it again.
            if (existingStockRefs.some(
              ref => readField('id', ref) === newStockRef.id
            )) {
              return existingStockRefs;
            }
      
            return [...existingStockRefs, newStockRef];
          }
        }
      })
    }
  });

  const [deleteStock] = useMutation(DELETE_STOCK, {
    update: (cache, { data: { deleteStock } }) => {
      deleteStock.__typename = 'Stock';

      cache.modify({
        id: cache.identify(deleteStock),
        fields: {
          stocks(existingStockRefs, { readField }) {
            console.log('DELETE', existingStockRefs);
            const newStocks = existingStockRefs.filter(
              (stockRef) => {
                console.log(stockRef)
                return deleteStock.id !== readField('id', stockRef)
              }
            );
            return newStocks;
          },
        },
      });
    }
  });

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

  const { stocks } = data;
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
