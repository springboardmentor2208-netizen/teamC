const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Find user by email
        const user = await User.findOne({ email: 'Teena K' });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${user.name} (${user.email}) is now an Admin!`);
        } else {
            console.log('User not found. Making the FIRST user an admin...');
            const firstUser = await User.findOne({});
            if (firstUser) {
                firstUser.role = 'admin';
                await firstUser.save();
                console.log(`User ${firstUser.name} (${firstUser.email}) is now an Admin!`);
            } else {
                console.log('No users found in database.');
            }
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

makeAdmin();
