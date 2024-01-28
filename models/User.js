const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contact',
        },
    ],
    image: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
