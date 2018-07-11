import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { createRenderer } from 'fela';
import { Provider } from 'react-fela';
import IndexScreen from './screens/Index';

const { document } = window;
const client = new ApolloClient({
  uri: '/graphql',
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
