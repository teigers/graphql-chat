const { MongoClient } = require('mongodb');
const { DataSource } = require('apollo-datasource');

class MongoDb extends DataSource {
  constructor(database, collectionName) {
    super();
    this.collection = database.collection(collectionName);
  }

  // XXX - YAGNI violation! Added methods the subclasses should use so
  // one easily can add caching at a later stage.

  async insertOne(input, options) {
    return this.collection.insertOne(input, options);
  }

  async find(query, options) {
    return this.collection.find(query, options);
  }

  async findOne(query, options) {
    return this.collection.findOne(query, options);
  }

  async updateOne(filter, update, options) {
    return this.collection.updateOne(filter, update, options);
  }

  async getCollection() {
    return this.collection;
  }
}

const connectMongoDb = async (connectionString, database, options) => {
  const client = new MongoClient(connectionString, options);
  await client.connect();
  return client.db(database);
};

module.exports = {
  MongoDb,
  connectMongoDb,
};
