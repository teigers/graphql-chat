const { ObjectId } = require('mongodb');
const { MongoDb } = require('./MongoDb');

module.exports = class Chats extends MongoDb {
  constructor(database) {   
    super(database, 'chats');
  }

  async create(participantIds) {
    const ids = participantIds.map(id => new ObjectId(id));
    const input = { 
      participants: ids, 
      messages: [] 
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
