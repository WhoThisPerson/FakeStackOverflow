const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    text: {
        type: String,
        required: true,
        maxLength: 140,
    },

    votes: {
        type: Number,
        default: 0,
        required: true,
    },

});

module.exports = mongoose.model("Comment", commentsSchema, "comments");
