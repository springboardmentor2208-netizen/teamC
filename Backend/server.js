const express = require('express');
// const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware'); // Will create this
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));