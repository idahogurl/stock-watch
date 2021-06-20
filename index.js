/* eslint-disable no-console */
const express = require('express');
// const bodyParser = require('body-parser');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');

const dotenv = require('dotenv');
const Rollbar = require('rollbar');
const resolvers = require('./server/graphql/resolvers');

dotenv.config();

async function startApolloServer() {

const typeDefs = fs.readFileSync('./server/graphql/schema.gql', 'utf8');

const app = express();
app.use('/', express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

const env = process.env.NODE_ENV || 'development';
console.log('ENV', env);
if (env === 'production') {
  console.log('PROD');
  const rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });
  rollbar.info('server started');
  app.use(rollbar.errorHandler());
}

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const server = new ApolloServer({ typeDefs, resolvers });

await server.start();
server.applyMiddleware({ app });

const port = process.env.PORT || 3000;
await new Promise(resolve => app.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer();
