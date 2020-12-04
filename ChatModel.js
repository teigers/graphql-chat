const { ObjectId } = require('mongodb');
const dbClient = require('./dbClient');

module.exports = class {
  constructor() {   
    this.db = dbClient.getConnection();
    this.collection = this.db.collection('chats');
  }

  async createChat(participants) {
    const _participantIds = participants.map(id => new ObjectId(id));
    const input = { 
      participants: _participantIds, 
      messages: [] 
    };
    const res = await this.collection.insertOne(input)
    const { ops } = res;     
    return ops[0]._id;
  }

  async getChatsByUser(userId) {
    const filter = {
      participants: new ObjectId(userId),
    };
    const chats = await this.collection.find(filter);
    return chats.toArray();
  }

  async getChatById(id) {
    return this.collection.findOne({ _id: new ObjectId(id) })
  }

  async addMessage(chatId, messageId) {
    const filter = {
      _id: new ObjectId(chatId)
    };
    const chat = await this.collection.findOne(filter)    
    chat.messages = [...chat.messages, messageId];

    const update = { 
      $set: chat,
    };
    
    this.collection.updateOne(filter, update);
  }
}