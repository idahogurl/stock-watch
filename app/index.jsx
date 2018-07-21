import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split, concat } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

import { createRenderer } from 'fela';
import { Provider } from 'react-fela';
import IndexScreen from './screens/Index';


const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Create an http link:
const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
});

// Create a WebSocket link:
const WS_HOST = `ws://${window.location.hostname}` || 'ws://localhost';

const wsLink = new WebSocketLink({
  uri: `${WS_HOST}:5000/subscriptions`,
  options: { reconnect: true },
});

const client = new ApolloClient({
  link: concat(
    errorLink,
    split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink,
    ),
  ),
  cache: new InMemoryCache(),
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
