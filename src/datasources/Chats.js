const { ObjectId } = require('mongodb');
const { MongoDb } = require('./MongoDb');

module.exports = class Chats extends MongoDb {
  constructor(database) {   
    super(database, 'chats');
  }

  async create({ participants, title }) {
    const ids = participants.map(id => new ObjectId(id));
    const input = {
      title, 
      participants: ids, 
      messages: [],
      created: new Date(),
    };
    const res = await this.insertOne(input)
    const { ops } = res;     
    return ops[0];
  }

  async getByUser(userId) {
    const query = {
      participants: new ObjectId(userId),
    };
    const chats = await this.find(query);
    return chats.toArray();
  }

  async getById(chatId) {
    return this.findOne({ _id: new ObjectId(chatId) })
  }
}
