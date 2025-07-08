const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// MongoDB Connect
mongoose.connect('process.env.MONGO_URI', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    secret: 'secretkey123',
    resave: false,
    saveUninitialized: true
}));

// View engine
app.set('view engine', 'ejs');

// Routes
const adminRoutes = require('./routes/admin');
app.use('/', adminRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
});
