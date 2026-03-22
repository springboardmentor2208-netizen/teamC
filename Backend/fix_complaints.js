const mongoose = require('mongoose');
require('dotenv').config();

const Complaint = require('./models/Complaint');
const User = require('./models/User');

async function fixOrphanedComplaints() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const users = await User.find({}).select('_id name email');
    console.log('Current users in DB:');
    users.forEach(u => console.log(`  ${u._id} — ${u.name} (${u.email})`));

    if (users.length === 0) {
        console.log('No users found! Something is wrong.');
        await mongoose.disconnect();
        return;
    }

    // Find orphaned complaints (user_id doesn't match any user)
    const orphaned = [];
    const complaints = await Complaint.find({});
    for (const c of complaints) {
        const owner = users.find(u => u._id.toString() === (c.user_id ? c.user_id.toString() : ''));
        if (!owner) {
            orphaned.push(c);
        }
    }

    console.log(`\nFound ${orphaned.length} orphaned complaint(s).`);

    if (orphaned.length === 0) {
        console.log('Nothing to fix!');
        await mongoose.disconnect();
        return;
    }

    // Assign first user as owner of all orphaned complaints
    const targetUser = users[0];
    console.log(`\nReassigning ${orphaned.length} orphaned complaint(s) to: ${targetUser.name} (${targetUser._id})`);

    for (const c of orphaned) {
        await Complaint.findByIdAndUpdate(c._id, { user_id: targetUser._id });
        console.log(`  Fixed complaint: "${c.title}" (${c._id})`);
    }

    console.log('\nDone! All orphaned complaints reassigned.');
    await mongoose.disconnect();
}

fixOrphanedComplaints().catch(console.error);
