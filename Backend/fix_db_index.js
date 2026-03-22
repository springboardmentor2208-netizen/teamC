require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    try {
        await db.collection('users').dropIndex('username_1');
        console.log('✅ Dropped stale username_1 unique index successfully!');
    } catch (err) {
        if (err.codeName === 'IndexNotFound') {
            console.log('ℹ️  username_1 index not found (already dropped).');
        } else {
            console.log('❌ Error:', err.message);
        }
    }

    const indexes = await db.collection('users').indexes();
    console.log('Remaining indexes:', indexes.map(i => i.name));
    await mongoose.disconnect();
})();
