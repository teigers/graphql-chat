const { PubSub } = require('apollo-server');

const pubSub = new PubSub();

module.exports = {
  Query: {
    user: async (_,  { id }, { dataSources: { Users } }) => Users.getById(id),
    users: async (_,  args, { dataSources: { Users } }) => Users.getAll(),
    chat: async (_, { chatId },  { dataSources: { Chats } }) => Chats.getById(chatId),
  },

  Mutation: {
    createUser: async (_, { userName },  { dataSources: { Users } }) => Users.create(userName),
    createChat: async (_, { participants },  { dataSources: { Chats } }) => Chats.create(participants),
    sendMessage: async (_, { chatId, input },  { dataSources: { Messages } }) => {
      const message = await Messages.create(chatId, input)
      pubSub.publish(chatId, { messageFeed: message });
      return message;
    },
  },

  Subscription: {  
    messageFeed: {
      subscribe: (_, { chatId }) => pubSub.asyncIterator(chatId),
    },
  },

  User: {
    id: obj => obj._id,
    chats: async (obj, args,  { dataSources: { Chats } }) => Chats.getByUser(obj._id),
  },

  Chat: {
    id: obj => obj._id,    
    participants: async (obj, args,  { dataSources: { Users } }) => Users.getMany(obj.participants),
    messages: async (obj, args,  { dataSources: { Messages } }) => Messages.getByChat(obj._id),
  },

  Message: {
    id: obj => obj._id,
    fromId: obj => obj.from,
    created: obj => new Date(obj.created).toISOString(),
  }
};
