const { ObjectId } = require('mongodb');
const dbClient = require('./dbClient');

module.exports = class {
  constructor() {  
    this.db = dbClient.getConnection();
    this.collection = this.db.collection('messages');
  }

  async getMessagesByChat(chatId) {    
    const filter = {
        chatId: new ObjectId(chatId),
    };
    const messages = await this.collection.find(filter);
    return messages.toArray();
  }

  async createMessage(input) {
    const message = {
      ...input,
      created: Date.now(),
      chatId: new ObjectId(input.chatId)
    }
    const { ops } = await this.collection.insertOne(message);
    return ops[0];
  }
}
