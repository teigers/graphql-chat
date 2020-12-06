const { PubSub } = require('apollo-server');

const pubSub = new PubSub();

module.exports = {
  Query: {
    user: async (_,  { id }, { dataSources: { UserModel } }) => UserModel.getById(id),
    users: async (_,  args, { dataSources: { UserModel } }) => UserModel.getAll(),
    chat: async (_, { chatId },  { dataSources: { ChatModel } }) => ChatModel.getById(chatId),
  },

  Mutation: {
    createUser: async (_, { userName },  { dataSources: { UserModel } }) => UserModel.create(userName),
    createChat: async (_, { input },  { dataSources: { ChatModel } }) => ChatModel.create(input),
    sendMessage: async (_, { chatId, input },  { dataSources: { MessageModel } }) => {
      const message = await MessageModel.create(chatId, input);
      for (const participantId of message.participants) {
        pubSub.publish(participantId, { messageFeed: message });
      }
      return message;
    },
  },

  Subscription: {  
    messageFeed: {
      subscribe: (_, { userId }) => pubSub.asyncIterator(userId),
    },
  },

  User: {
    id: obj => obj._id,
    chats: async (obj, args,  { dataSources: { ChatModel } }) => ChatModel.getByUser(obj._id),
  },

  Chat: {
    id: obj => obj._id,    
    participants: async (obj, args,  { dataSources: { UserModel } }) => UserModel.getMany(obj.participants),
    messages: async (obj, args,  { dataSources: { MessageModel } }) => MessageModel.getByChat(obj._id),
    created: obj => new Date(obj.created).toISOString(),
  },

  Message: {
    id: obj => obj._id,
    fromId: obj => obj.from,
    created: obj => new Date(obj.created).toISOString(),
  }
};
