const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Complaint = require('./models/Complaint');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkComplaints = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const complaints = await Complaint.find({}, 'title status _id');
        console.log('\n--- Active Complaints ---');
        complaints.forEach(c => {
            console.log(`ID: ${c._id} | Title: ${c.title} | Status: ${c.status}`);
        });
        console.log('-------------------------\n');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkComplaints();
