import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FelaComponent } from 'react-fela';
import Card from './Card';

class Stock extends PureComponent {
  constructor() {
    super();
    this.deleteStock = this.deleteStock.bind(this);
  }

  deleteStock() {
    const { mutate, stock: { id } } = this.props;
    mutate({ variables: { id } })
      .then()
      .catch();
  }

  render() {
    const { stock: { id, company, price } } = this.props;

    const buttonStyle = {
      backgroundColor: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'pointer',
    };

    const deleteButton = (
      <FelaComponent
        style={buttonStyle}
        >
        {({ className }) => <button label="Delete Stock" type="button" className={className} title="Delete Stock" onClick={this.deleteStock}><i className="fa fa-close" /></button>}
      </FelaComponent>
    );

    const header = (
      <div className="card-header d-flex">
        <div className="flex-grow-1">{id}</div>
        {deleteButton}
      </div>
    );

    return (
      <Card border="border-mute" header={header}>
        {`Company: ${company}`}
        <br />
        {`Value: $${price.toFixed(2)} USD`}
      </Card>
    );
  }
}


Stock.propTypes = {
  stock: PropTypes.shape({
    id: PropTypes.string,
    company: PropTypes.string,
    price: PropTypes.number,
    chart: PropTypes.array,
  }).isRequired,
  mutate: PropTypes.func.isRequired,
};

export default Stock;
