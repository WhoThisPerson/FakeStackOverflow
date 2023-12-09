// Answer Document Schema
const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },

    ans_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    ans_date_time: {
        type: Date, 
        default: Date.now
    },

    upvotes: {
        type: Number,
        default: 0,
    },

    downvotes: {
        type: Number,
        default: 0,
    },

});

answersSchema.virtual('url').get(function () {
    return `/posts/answer/${this._id}`;
});

module.exports = mongoose.model("Answer", answersSchema, "answers");
