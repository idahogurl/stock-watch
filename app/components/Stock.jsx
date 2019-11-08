import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FelaComponent } from 'react-fela';
import Card from './Card';

class Stock extends PureComponent {
  deleteStock = this.deleteStock.bind(this);

  deleteStock() {
    const { mutate, id } = this.props;
    mutate({ variables: { id } })
      .then()
      .catch();
  }

  render() {
    const { symbol, company, price } = this.props;

    const buttonStyle = {
      backgroundColor: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'pointer',
    };

    const deleteButton = (<FelaComponent
      style={buttonStyle}
      render={({ className }) =>
        <button type="button" className={className} title="Delete Stock" onClick={this.deleteStock}><i className="fa fa-close" /></button>}
    />);

    const header = (
      <div className="card-header d-flex">
        <div className="flex-grow-1">{symbol}</div>
        {deleteButton}
      </div>);

    return (
      <Card border="border-mute" header={header}>
        Company: {company}<br />
        Value: ${price} USD
      </Card>);
  }
}


Stock.propTypes = {
  id: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  mutate: PropTypes.func.isRequired,
};

export default Stock;
