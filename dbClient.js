const { MongoClient } = require('mongodb');

let db;

const connect = async () => {  
  const client = new MongoClient(process.env.CONNECTION_STRING, { useUnifiedTopology: true });
  await client.connect();
  
  db = client.db(process.env.DATABASE);    
}

const getConnection = () => {
  if (!db) {
    throw new Error('Not connected to database');
  }
  
  return db;
}

module.exports = {
  connect,
  getConnection,
};