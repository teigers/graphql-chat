const { UserInputError } = require("apollo-server");
const BaseModel = require('./BaseModel');

module.exports = class extends BaseModel {
  async getByChat(chatId) {
    if (!chatId) {
      throw new UserInputError('No chatId provided');
    } 

    return this.Messages.getByChat(chatId);
  }

  async create(chatId, input) {
    const { from, message } = input;
    
    if (!chatId) {
      throw new UserInputError('No chatId provided');
    }

    if (!from) {
      throw new UserInputError('No sender provided');
    }

    if (!message) {
      throw new UserInputError('No message provided');
    }

    const chat = await this.Chats.getById(chatId);

    if (!chat) {
      throw new UserInputError('Chat doesn\'t exist');
    }

    const user = await this.Users.getById(from);
    
    if (!user) {
      throw new UserInputError('User doesn\'t exist');
    }

    const participants = chat.participants.map(id => id.toString());
    
    if (!participants.includes(from)) {
      throw new UserInputError('Sender is not a participant in the chat');
    }

    const savedMessage = await this.Messages.create(chatId, input);
    
    return {
      ...savedMessage, 
      participants,
    };
  }
}