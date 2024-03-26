// Mongoose library enables schema creation, model definition and interaction with the database
const {Schema, model} = require('mongoose');

/**
 * Message Schema
 * Defines the structure of messages in the 'messages' collection in MongoDB.
 * Represents the properties and format of messages stored in MongoDB 'messages' collection.
 */
const MessageSchema = new Schema({
	senderId: {type: Schema.Types.ObjectId, ref: 'users', required: true}, // ID of the message sender with the reference to the 'users' collection
	receiverId: {type: Schema.Types.ObjectId, ref: 'users', required: true}, // ID of the message receiver with the reference to the 'users' collection
	createdAt: {type: Date, default: () => new Date().getTime()}, // Timestamp when the message was created
	message: {type: String, required: true}, // Content of the message
	isPublic: {type: Boolean, default: false}, // True if this is a public message, false if private
	seenAt: {type: Date, default: null} // Timestamp when the message was seen by the receiver
});

/**
 * MessageModel
 * Mongoose model based on MessageSchema, represents the 'messages' collection.
 * Provides access to CRUD operations for messages in MongoDB.
 * @exports MessageModel
 */
const MessageModel = model('messages', MessageSchema);

/**
 * Exports the MessageModel to enable its use throughout the application.
 * @module messageModel
 */
module.exports = MessageModel;
