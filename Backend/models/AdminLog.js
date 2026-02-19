const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    action: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("AdminLog", adminLogSchema);
