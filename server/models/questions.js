// Question Document Schema
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50,
    },

    summary: {
        type: String,
        required: true,
        maxLength: 140,
    },
    
    text: {
        type: String,
        required: true
    },

    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true,
        minlength: 1,
    }],

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],

    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
        minlength: 0,
    }],

    asked_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: "Anonymous",
    },

    ask_date_time: {
        type: Date, 
        default: Date.now
    },

    views: {
        type: Number,
        default: 0
    },

    upvotes: {
        type: Number,
        default: 0,
    },

    downvotes: {
        type: Number,
        default: 0,
    }

})

questionSchema.virtual("url").get(function () {
    return `posts/question/${this._id}`;
});

module.exports = mongoose.model("Question", questionSchema, "questions");
