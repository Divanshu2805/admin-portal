const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const User = require('../models/User');
const XLSX = require('xlsx');

// File upload config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ---- Admin Login ----
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.isAdmin = true;
        res.redirect('/dashboard');
    } else {
        res.send('Invalid credentials');
    }
});

// ---- Dashboard ----
router.get('/dashboard', (req, res) => {
    if (!req.session.isAdmin) return res.redirect('/login');
    res.render('dashboard');
});

// ---- User Form ----
router.get('/add-user', (req, res) => {
    res.render('add-user');
});

router.post('/add-user', upload.single('document'), async (req, res) => {
    const { name, email } = req.body;
    const document = req.file.filename;

    await User.create({ name, email, document });
    res.redirect('/users');
});

// ---- Show Users ----
router.get('/users', async (req, res) => {
    const users = await User.find({});
    res.render('user', { users });
});

// ---- User Details ----
router.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('user-details', { user });
});

// ---- Approve / Reject ----
router.post('/user/:id/update', async (req, res) => {
    const { status, remarks } = req.body;
    await User.findByIdAndUpdate(req.params.id, { status, remarks });
    res.redirect('/users');
});
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// ---- Root redirect to Login ----
router.get('/', (req, res) => {
    res.redirect('/login');
});

// ---- Bulk Upload Form ----
router.get('/bulk-upload', (req, res) => {
    res.render('add-bulk-users');
});

// ---- Bulk Upload Handler ----
router.post('/bulk-upload', upload.single('excel'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        // data = [{name:..., email:..., document:...}, ...]
        await User.insertMany(data);
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Bulk upload error: ' + err.message);
    }
});

module.exports = router;
