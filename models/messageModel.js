// Mongoose library enables schema creation, model definition and interaction with the database
const { Schema, model } = require('mongoose');

/**
 * Message Schema
 * Defines the structure of messages in the 'messages' collection in MongoDB.
 * Represents the properties and format of messages stored in MongoDB 'messages' collection.
 */
const MessageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, required: true }, // ID of the message sender
    receiverId: { type: Schema.Types.ObjectId, required: true }, // ID of the message receiver
    createdAt: { type: Date, default: () => new Date().getTime() }, // Timestamp when the message was created
    message: { type: String, required: true }, // Content of the message
    seenAt: { type: Date, default: null }, // Timestamp when the message was seen by the receiver
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
