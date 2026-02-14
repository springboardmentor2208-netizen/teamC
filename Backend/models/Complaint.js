const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    issueType: {
        type: String,
        required: [true, 'Please select an issue type'],
        enum: ['garbage', 'pothole', 'street_light', 'water_leakage', 'other']
    },
    priority: {
        type: String,
        required: [true, 'Please select a priority'],
        enum: ['low', 'medium', 'high', 'critical']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    landmark: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    location: {
        type: {
            lat: Number,
            lng: Number
        },
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved', 'rejected'],
        default: 'pending'
    },
    image: {
        type: String,
        required: false
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        text: {
            type: String,
            required: [true, 'Please add a comment']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
