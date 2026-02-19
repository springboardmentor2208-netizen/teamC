const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
    content: String
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
