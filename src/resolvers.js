const { PubSub, withFilter } = require('apollo-server');

const pubSub = new PubSub();

// TODO: Wrap pubSub and filter logic in a class.

module.exports = {
  Query: {
    user: async (_,  { id }, { dataSources: { UserModel } }) => UserModel.getById(id),
    users: async (_,  args, { dataSources: { UserModel } }) => UserModel.getAll(),
    chat: async (_, { chatId },  { dataSources: { ChatModel } }) => ChatModel.getById(chatId),
  },

  Mutation: {
    createUser: async (_, { userName },  { dataSources: { UserModel } }) => UserModel.create(userName),
    createChat: async (_, { participants },  { dataSources: { ChatModel } }) => ChatModel.create(participants),
    sendMessage: async (_, { chatId, input },  { dataSources: { MessageModel } }) => {
      const message = await MessageModel.create(chatId, input);
      pubSub.publish('messagePublished', { messageFeed: message });
      return message;
    },
  },

  Subscription: {  
    messageFeed: {
      subscribe: withFilter(
          () => pubSub.asyncIterator('messagePublished'),
          (payload, { userId }) => {
            const { messageFeed: { participants }} = payload;
            return participants.includes(userId);
          }
        ),
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
  },

  Message: {
    id: obj => obj._id,
    fromId: obj => obj.from,
    created: obj => new Date(obj.created).toISOString(),
  }
};
