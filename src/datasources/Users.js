const { ObjectId } = require('mongodb');
const { MongoDb } = require('./MongoDb');

module.exports = class Users extends MongoDb {
  constructor(database) {
    super(database, 'users');      
  }

  async getById(userId) {
    return this.findOne({ _id: new ObjectId(userId) });
  }

  async getByUserName(userName) {
    return this.findOne({ userName });
  }

  async getMany(userIds) {
      const ids = userIds.map(id => new ObjectId(id));
      const filter = {
          _id: { $in: ids },
      };
      const cursor = await this.find(filter);
      return cursor.toArray();
  }

  async getAll() {
      const cursor = await this.find({});
      return cursor.toArray();
  }

  async create(userName) {
    const { ops } = await this.insertOne({ userName });
    return ops[0];
  }
}
