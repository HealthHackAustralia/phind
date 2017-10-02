import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Chats, Messages, Tasks } from '../lib/collections';
 
Meteor.methods({
  newMessage(message) {
  	if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to send message.');
    }
  	check(message, Match.OneOf(
      {
        text: String,
        type: String,
        chatId: String
      },
      {
        picture: String,
        type: String,
        chatId: String
      }
    ));
    
    message.userId = this.userId;
    message.timestamp = new Date();
 
    const messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });
 
    return messageId;
  },
  updateName(name) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update his name.');
    }
 
    check(name, String);
 
    if (name.length === 0) {
      throw Meteor.Error('name-required', 'Must provide a user name');
    }
 
    return Meteor.users.update(this.userId, { $set: { 'profile.name': name } });
  },
  updateTask(taskId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update his name.');
    }
 
    check(taskId, String);
    
    const task = Tasks.findOne(taskId);

    if (!task || task.userId !== this.userId) {
      throw new Meteor.Error('task-not-exists',
        'Task deos not exists');
    }

    return Tasks.update(taskId, { $set: { 'checked': !task.checked } });
  },
  newChat(otherId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to create a chat.');
    }
 
    check(otherId, String);
    const otherUser = Meteor.users.findOne(otherId);
 
    if (!otherUser) {
      throw new Meteor.Error('user-not-exists',
        'Chat\'s user not exists');
    }
 
    const chat = {
      userIds: [this.userId, otherId],
      createdAt: new Date()
    };
 
    const chatId = Chats.insert(chat);
 
    return chatId;
  },
  insertTask(text) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to create a task.');
    }
 
    check(text, String);
    
    const task = {
      title: text,
      userId: this.userId,
      createdAt: new Date()
    };
 
    const taskId = Tasks.insert(task);
 
    return taskId;
  },
  removeTask(taskId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to remove a chat.');
    }
 
    check(taskId, String);
 
    const task = Tasks.findOne(taskId);
 
    if (!task || task.userId !== this.userId) {
      throw new Meteor.Error('task-not-exists',
        'Task deos not exists');
    }
 
 
    return Tasks.remove({ _id: taskId });
  },
  removeChat(chatId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to remove a chat.');
    }
 
    check(chatId, String);
 
    const chat = Chats.findOne(chatId);
 
    if (!chat || !_.include(chat.userIds, this.userId)) {
      throw new Meteor.Error('chat-not-exists',
        'Chat not exists');
    }
 
    Messages.remove({ chatId: chatId });
 
    return Chats.remove({ _id: chatId });
  },
  updatePicture(data) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update his picture.');
    }
 
    check(data, String);
 
    return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
  }
});