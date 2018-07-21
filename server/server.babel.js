/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './graphql/resolvers';

require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.use('/', express.static('public'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const typeDefs = fs.readFileSync(path.resolve(__dirname, 'graphql/schema.gql'), 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const WS_PORT = process.env.WS_PORT || 5000;
const websocketServer = createServer(app);
websocketServer.listen(WS_PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema,
    },
    { server: websocketServer, path: '/subscriptions' },
  );
  console.log(`Websocket is listening on port ${websocketServer.address().port}`);
});

app.use('/graphql', graphqlExpress(() => ({ schema })));

const WS_HOST = process.env.WS_HOST || 'ws://localhost';

app.get('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `${WS_HOST}:${WS_PORT}/subscriptions`,
}));

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log('Server Started at port 3000');
});
