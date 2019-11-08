/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createServer } = require('http');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const fs = require('fs');
const { makeExecutableSchema } = require('graphql-tools');
const dotenv = require('dotenv');
const Rollbar = require('rollbar');
const resolvers = require('./server/graphql/resolvers');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const typeDefs = fs.readFileSync('./server/graphql/schema.gql', 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use('/graphql', graphqlExpress(() => ({ schema })));
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  app.get(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
    }),
  );
} else {
  const rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });
  app.use(rollbar.errorHandler());
}

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const httpServer = createServer(app);
httpServer.listen(port, () => {
  console.log('Server Started at port 3000');
});
