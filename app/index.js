/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render } from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

import { createRenderer } from 'fela';
import { RendererProvider } from 'react-fela';
import IndexScreen from './screens/Index';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
  credentials: 'same-origin',
  resolvers: {
    Stock: {
      _deleted: stock => Boolean(stock._deleted),
    }
  },
});



const renderer = createRenderer();

render(
  <ApolloProvider client={client}>
    <RendererProvider renderer={renderer}>
      <IndexScreen />
    </RendererProvider>
  </ApolloProvider>,
  document.getElementById('app'),
);
