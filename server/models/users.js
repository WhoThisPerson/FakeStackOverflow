const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    
    username: {
        type: String,
        requred: true,
        default: "Anonymous",
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
        enum: ["Admin", "User"],
        default: "User",
    },

    questions_asked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    }],

    answers_posted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
    }],

    tags_created: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    }],

    comments_posted : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],

    reputation: {
        type: Number,
        default: 0,
    },

    date_created: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("User", usersSchema, "users");
