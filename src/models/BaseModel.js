module.exports = class {
  initialize({ context }) {
    this.context = context;
  }

  get Users() {
    return this.context.dataSources.Users;
  }

  get Messages() {
    return this.context.dataSources.Messages;
  }

  get Chats() {
    return this.context.dataSources.Chats;
  }
}