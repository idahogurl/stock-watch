import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FelaComponent } from 'react-fela';
import Card from './Card';

class Stock extends PureComponent {
  constructor() {
    super();
    this.handleDeleteClicked = this.handleDeleteClicked.bind(this);
  }

  handleDeleteClicked() {
    const { deleteStock, id } = this.props;
    deleteStock({ variables: { id } })
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

    const deleteButton = (
      <FelaComponent
        style={buttonStyle}
      >
        {({ className }) => <button type="button" aria-label="Delete Stock" className={className} title="Delete Stock" onClick={this.handleDeleteClicked}><i className="fa fa-close" /></button>}
      </FelaComponent>
    );

    const header = (
      <div className="card-header d-flex">
        <div className="flex-grow-1">{symbol}</div>
        {deleteButton}
      </div>
    );

    return (
      <Card border="border-mute" header={header}>
        {`Company: ${company}`}
        <br />
        {`Value: $${price} USD`}
      </Card>
    );
  }
}


Stock.propTypes = {
  id: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  deleteStock: PropTypes.func.isRequired,
};

export default Stock;
