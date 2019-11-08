import React from 'react';
import PropTypes from 'prop-types';
import { FelaComponent } from 'react-fela';
import classNames from 'classnames';

const Container = ({ additionalStyle, children }) => {
  const style = {
    marginTop: '1em',
    marginBottom: '1em',
    paddingTop: '1em',
    backgroundColor: 'white',
    minHeight: '100vh',
    ...additionalStyle,
  };

  return (
    <FelaComponent
      style={style}
    >
      {({ className }) => <div className={classNames('container', className)}>{children}</div>}
    </FelaComponent>
  );
};

Container.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  additionalStyle: PropTypes.object,
  children: PropTypes.node.isRequired,
};

Container.defaultProps = {
  additionalStyle: {},
};

export default Container;
