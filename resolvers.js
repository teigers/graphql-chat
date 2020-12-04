module.exports = {
  Query: {
    user: async (_,  { id }, { dataSources }) => {
      const { UserModel } = dataSources;
      return UserModel.getUserById(id);
    },

    users: async (_,  args, { dataSources }) => {
      const { UserModel } = dataSources;
      return UserModel.getUsers();
    },
  },

  Mutation: {
    createUser: async (_, { userName },  { dataSources }) => { 
      const { UserModel } = dataSources;
      return UserModel.createUser(userName);
    },
    createChat: async (_, { participants },  { dataSources }) => {
      const { ChatModel } = dataSources;
      return ChatModel.createChat(participants)
    },
    sendMessage: async (_, { chatId, input },  { dataSources }) => {
      const { ChatModel, MessageModel } = dataSources;
      const message = await MessageModel.createMessage({ chatId, ...input });
      await ChatModel.addMessage(chatId, message._id);
      return message;
    },
  },

  User: {
    id: obj => obj._id,
    chats: async (obj, args,  { dataSources }) => {
      const { ChatModel } = dataSources;
      return ChatModel.getChatsByUser(obj._id);
    }, 
  },

  Chat: {
    id: obj => obj._id,    
    participants: async (obj, args,  { dataSources }) => {
      const { UserModel } = dataSources;
      return UserModel.getUsersById(obj.participants);
    },
    messages: async (obj, args,  { dataSources }) => {
      const { MessageModel } = dataSources;
      return MessageModel.getMessagesByChat(obj._id);
    },
  },

  Message: {
    id: obj => obj._id,
    from: async (obj,  args, { dataSources }) => {
      const { UserModel } = dataSources;
      return UserModel.getUserById(obj.from);
    },
    created: obj => new Date(obj.created).toISOString(),
  }
};