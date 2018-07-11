import React from 'react';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import classNames from 'classnames';

import CREATE_STOCK from '../graphql/StockForm.gql';
import GET_STOCKS from '../graphql/StockList.gql';

import Card from './Card';

const StockForm = function StockForm() {
  return (
    <Mutation
      mutation={CREATE_STOCK}
      update={(cache, { data: { createStock } }) => {
            const args = { query: GET_STOCKS };
            const stored = cache.readQuery(args);
            stored.stocks = stored.stocks.concat([createStock]);
            args.data = stored;
            cache.writeQuery(args);
          }}
    >
      {mutate => (<Formik
        initialValues={{
          symbol: '',
        }}

        validateOnBlur={false}
        validateOnChange={false}

        validate={(values) => {
          const errors = {};
          if (values.symbol.trim() === '') errors.question = 'Field is required';

          return errors;
        }}

        onSubmit={(values, { setSubmitting, setFieldError }) => {
          mutate({ variables: { ...values } })
          .then(() => {
            setSubmitting(false);
          })
          .catch((err) => {
            setFieldError('symbol', err.graphQLErrors[0].message);
            setSubmitting(false);
          });
        }}

        render={({
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Card border="border-success">
            <p style={{ fontSize: '14px' }}>Syncs realtime across clients</p>
            <form onSubmit={handleSubmit} className="form form-inline">
              <input
                type="text"
                name="symbol"
                onChange={handleChange}
                onBlur={handleBlur}
                className={classNames('form-control form-control-sm mr-1', { 'is-invalid': errors.symbol })}
                placeholder="Stock symbol"
              />
              <button type="submit" className="btn btn-success btn-sm" disabled={isSubmitting}>
                {isSubmitting ? <span><i className="fa fa-spin fa-spinner" /> Adding</span> : 'Add'}
              </button>
              {errors.symbol && <small className="text-danger">{errors.symbol}</small>}
            </form>
          </Card>
        )}
      />)}
    </Mutation>);
};

export default StockForm;
