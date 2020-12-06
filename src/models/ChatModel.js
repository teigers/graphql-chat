const { UserInputError } = require("apollo-server");
const BaseModel = require('./BaseModel');

module.exports = class extends BaseModel {
  async getById(chatId) {
    if (!chatId) {
      throw new UserInputError('No chatId provided');
    } 

    return this.Chats.getById(chatId);
  } 

  async getByUser(userId) {
    if (!userId) {
      throw new UserInputError('No userId provided');
    } 

    return this.Chats.getByUser(userId);
  }

  async create(participantIds) {
    if (!(participantIds && participantIds.length)) {
      throw new UserInputError('No participants provided');
    }

    if (participantIds.length < 2) {
      throw new UserInputError('A chat must have 2 or more participants');
    }

    const participants = await this.Users.getMany(participantIds);

    if (participants.length !== participantIds.length) {
      throw new UserInputError('Invalid participant id');
    }

    return this.Chats.create(participantIds);
  }
}