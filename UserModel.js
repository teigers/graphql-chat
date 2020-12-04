const { ObjectId } = require('mongodb');
const dbClient = require('./dbClient');

module.exports = class {
    constructor() {  
      this.db = dbClient.getConnection();
      this.collection = this.db.collection('users');
    }
  
    async getUserById(id) {
      return this.collection.findOne({ _id: new ObjectId(id) });
    }

    async getUsersById(ids) {
        const _ids = ids.map(id => new ObjectId(id));
        const filter = {
            _id: { $in: _ids },
        };
        const cursor = await this.collection.find(filter);
        return cursor.toArray();
    }

    async getUsers() {
        const cursor = await this.collection.find({});
        return cursor.toArray();
    }
  
    async createUser(userName) {
      const { ops } = await this.collection.insertOne({ userName });
      return ops[0];
    }
  }
  