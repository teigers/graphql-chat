const { ApolloServer, gql } = require('apollo-server');
const dotenv = require('dotenv');
const fs = require('fs');
const { connectMongoDb } = require('./datasources/MongoDb');
const Users = require('./datasources/Users');
const Chats = require('./datasources/Chats');
const Messages = require('./datasources/Messages');
const resolvers = require('./resolvers');

dotenv.config();

const typeDefs = gql(`${fs.readFileSync('./schema.graphql')}`);

let database; 

const server = new ApolloServer({
  typeDefs,
  resolvers,   
  dataSources: () => ({
    Users: new Users(database),
    Chats: new Chats(database),
    Messages: new Messages(database),
  }),
});

const port = process.env.PORT || 4000;

const bootStrap = async () => {
  database = await connectMongoDb(
    process.env.CONNECTION_STRING, 
    process.env.DATABASE,
    { useUnifiedTopology: true },
  );
  console.log('Connected to database');
  server.listen({ port }).then(({ url, subscriptionsUrl }) => {
    console.log(`server listening at ${url}`);
    console.log(`subscription listening at ${subscriptionsUrl}`);
  });
};

bootStrap();
