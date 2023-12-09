// Tag Document Schema
const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    created_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }]
});

tagsSchema.virtual('url').get(function () {
    return `/posts/tag/${this._id}`;
});

module.exports = mongoose.model("Tag", tagsSchema, "tags");
