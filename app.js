const { ApolloServer, gql } = require('apollo-server');
const dotenv = require('dotenv');
const fs = require('fs');
const resolvers = require('./resolvers');
const dbClient = require('./dbClient');
const UserModel = require('./UserModel');
const ChatModel = require('./ChatModel');
const MessageModel = require('./MessageModel');

dotenv.config();

const typeDefs = gql(`${fs.readFileSync('./schema.graphql')}`);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      UserModel: new UserModel(),
      ChatModel: new ChatModel(),
      MessageModel: new MessageModel(),
    }),
});

const port = process.env.PORT || 4000;

const bootStrap = async () => {
  await dbClient.connect();
  console.log('Connected to database');
  server.listen({ port }).then(({ url }) => {
    console.log(`Server listening at ${url}`);
  });
};

bootStrap();
