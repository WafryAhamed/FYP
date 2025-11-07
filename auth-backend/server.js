const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => res.send('Backend API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
