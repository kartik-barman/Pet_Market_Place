import mongoose from "mongoose";

// Define the schema for storing contact messages
const contactMessageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Basic email validation regex
    },
    topic: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Create the model based on the schema
export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);


