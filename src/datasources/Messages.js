const { ObjectId } = require('mongodb');
const { MongoDb } = require('./MongoDb');

module.exports = class Messages extends MongoDb {
  constructor(database) {
    super(database, 'messages');
  }

  async getByChat(chatId) {    
    const query = {
        chatId: new ObjectId(chatId),
    };
    const messages = await this.find(query);
    return messages.toArray();
  }

  async create(chatId, input) {
    const message = {
      ...input,
      created: Date.now(),
      chatId: new ObjectId(chatId)
    }
    const { ops } = await this.insertOne(message);
    return ops[0];
  }
}
