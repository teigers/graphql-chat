module.exports = {
  Query: {
    user: async (_,  { id }, { dataSources: { Users } }) => Users.getById(id),
    users: async (_,  args, { dataSources: { Users } }) => Users.getAll(),
  },

  Mutation: {
    createUser: async (_, { userName },  { dataSources: { Users } }) => Users.create(userName),
    createChat: async (_, { participants },  { dataSources: { Chats } }) => Chats.create(participants),
    sendMessage: async (_, { chatId, input },  { dataSources: { Messages } }) => (
      Messages.create(chatId, input)
    ),
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
    from: async (obj,  args, { dataSources: { Users } }) => Users.getById(obj.from),
    created: obj => new Date(obj.created).toISOString(),
  }
};