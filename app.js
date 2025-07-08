const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// MongoDB Connect
mongoose.connect('mongodb://127.0.0.1:27017/adminPortalDB', {
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
