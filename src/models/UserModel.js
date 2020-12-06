const { UserInputError } = require("apollo-server");
const BaseModel = require('./BaseModel');

module.exports = class extends BaseModel {
  async getById(userId) {
    if (!userId) {
      throw new UserInputError('No userId provided');
    } 

    return this.Users.getById(userId);
  }

  async getAll() {
    return this.Users.getAll();
  }

  async getMany(userIds) {
    if (!(userIds && userIds.length)) {
      throw new UserInputError('No userId\'s provided');
    } 

    return this.Users.getMany(userIds);
  }

  async create(userName) {
    if (!userName) {
      throw new UserInputError('No userName provided');
    }

    const user = await this.Users.getByUserName(userName);
    if (user) {
      throw new UserInputError('Username already exists');
    }

    return this.Users.create(userName);
  }
}