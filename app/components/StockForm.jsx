import React from 'react';
import { gql } from '@apollo/client'
import { Formik } from 'formik';
import classNames from 'classnames';

import Card from './Card';

import stockGql from '../graphql/ClientStock.gql';

const STOCK_FRAGMENT = gql(stockGql);

const StockForm = function StockForm({ createStock }) {
  return (
    <Formik
      initialValues={{
        id: '',
      }}

      validateOnBlur={false}
      validateOnChange={false}

      validate={(values) => {
        const errors = {};
        if (values.id.trim() === '') errors.question = 'Field is required';

        return errors;
      }}

      onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
        createStock({ variables: { __typename: 'Stock', ...values },
          update(cache, { data: { createStock } }) {
            cache.modify({
              fields: {
                stocks(existingStockRefs = [], { readField }) {
                  const newStockRef = cache.writeFragment({
                    data: { ...createStock },
                    fragment: STOCK_FRAGMENT
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
        })
          .then(() => {
            setSubmitting(false);
            resetForm();
          })
          .catch((err) => {
            setFieldError('id', err.message.replace('GraphQL error:', ''));
            setSubmitting(false);
          });
      }}
    >{
        ({
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
                name="id"
                onChange={handleChange}
                onBlur={handleBlur}
                className={classNames('form-control form-control-sm mr-1', { 'is-invalid': errors.id })}
                placeholder="Stock symbol"
                required={true}
              />
              <button type="submit" className="btn btn-success btn-sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span>
                    <i className="fa fa-spin fa-spinner" />
                    {' '}
                    Adding
                  </span>
                ) : 'Add'}
              </button>
              {errors.id && <small className="text-danger">{errors.id}</small>}
            </form>
          </Card>
        )}
    </Formik>);
};

export default StockForm;
