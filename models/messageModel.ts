// Mongoose library enables schema creation, model definition, and interaction with the database (including Model and Document types)
import {Schema, model, Model, Document} from 'mongoose';

/**
 * Defines the structure and properties of a message document stored in the MongoDB 'messages' collection.
 * Extends the Mongoose Document type for enhanced TypeScript support, providing additional functionality and typings
 * for interacting with MongoDB documents.
 * @interface Message
 */
interface Message extends Document {
	senderId: Schema.Types.ObjectId; // ID of the message sender
	receiverId: Schema.Types.ObjectId; // ID of the message receiver
	createdAt: Date; // Timestamp when the message was created
	message: string; // Content of the message
	seenAt?: Date | null; // Timestamp when the message was seen by the receiver (optional)
}

/**
 * Message Schema
 * Defines the structure of messages in the 'messages' collection in MongoDB.
 * Represents the properties and format of messages stored in MongoDB 'messages' collection.
 */
const MessageSchema = new Schema({
	senderId: {type: Schema.Types.ObjectId, required: true}, // ID of the message sender
	receiverId: {type: Schema.Types.ObjectId, required: true}, // ID of the message receiver
	createdAt: {type: Date, default: () => new Date().getTime()}, // Timestamp when the message was created
	message: {type: String, required: true}, // Content of the message
	seenAt: {type: Date, default: null} // Timestamp when the message was seen by the receiver
});

/**
 * MessageModel
 * Mongoose model based on MessageSchema, represents the 'messages' collection.
 * Provides access to CRUD operations for messages in MongoDB.
 * This Model represents the MongoDB 'messages' collection and is typed as Model<Message & Document>,
 * where 'Message' is the interface defining the message document structure, and 'Document' is the Mongoose document type.
 * @exports MessageModel
 * @type {Model<Message & Document>}
 */
const MessageModel = model<Message>('messages', MessageSchema) as Model<Message & Document>;

/**
 * Exports the MessageModel to enable its use throughout the application.
 * @module messageModel
 */
export default MessageModel;
