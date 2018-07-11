import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Card = props => (
  <div className={classNames('card m-3', props.border)} style={{ width: '20rem' }}>
    {props.header}
    <div className="card-body">
      {props.children}
    </div>
  </div>);

Card.propTypes = {
  border: PropTypes.string.isRequired,
  header: PropTypes.element,
  children: PropTypes.node.isRequired,
};

Card.defaultProps = {
  header: null,
};

export default Card;
