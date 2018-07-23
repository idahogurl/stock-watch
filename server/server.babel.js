/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer } from 'http';
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

app.use('/graphql', graphqlExpress(() => ({ schema })));

const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  app.get('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));
}

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

const httpServer = createServer(app);
httpServer.listen(port, () => {
  console.log('Server Started at port 3000');
});
