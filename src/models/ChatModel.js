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

  async create(input) {
    const { participants, title } = input;

    if(!title) {
      throw new UserInputError('No title provided');
    }

    if (!(participants && participants.length)) {
      throw new UserInputError('No participants provided');
    }

    if (participants.length < 2) {
      throw new UserInputError('A chat must have 2 or more participants');
    }

    const storedParticipants = await this.Users.getMany(participants);

    if (participants.length !== storedParticipants.length) {
      throw new UserInputError('Invalid participant id');
    }

    return this.Chats.create({ participants, title });
  }
}