import React from 'react';
import { Formik } from 'formik';
import classNames from 'classnames';

import Card from './Card';

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
        createStock({ variables: { __typename: 'Stock', ...values } })
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
