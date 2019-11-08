import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

import { createRenderer } from 'fela';
import { Provider } from 'react-fela';
import IndexScreen from './screens/Index';

const client = new ApolloClient({
  uri: '/graphql',
  credentials: 'same-origin',
});

const renderer = createRenderer();

render(
  <ApolloProvider client={client}>
    <Provider renderer={renderer}>
      <IndexScreen />
    </Provider>
  </ApolloProvider>,
  document.getElementById('app'),
);
