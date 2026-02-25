require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const indexes = await db.collection('users').indexes();
    const users = await db.collection('users').find({}).toArray();
    require('fs').writeFileSync('db_check_output.txt',
        'INDEXES:\n' + JSON.stringify(indexes, null, 2) +
        '\n\nUSERS:\n' + users.map(u => u.email + ' | verified:' + u.isVerified).join('\n')
    );
    console.log('Written to db_check_output.txt');
    await mongoose.disconnect();
})();
