const express = require('express');
const path = require('path');
const cors = require('cors'); 
const sqlite3 = require('sqlite3').verbose();

const app = express();

// --- DATABASE CONNECTION ---
// This uses an absolute path so it works no matter where you start the terminal
const dbPath = path.join(__dirname, 'pregnancy_app.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to pregnancy_app.db");
});

// --- DATABASE SETUP ---
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT UNIQUE,
        password TEXT,
        due_date TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_profiles (
        profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        weeks_pregnant TEXT,
        due_date TEXT,
        baby_name TEXT,
        age TEXT,
        height TEXT,
        weight TEXT,
        blood_group TEXT
    )`);
});

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- STATIC FILES (THE FIX) ---
// This tells the server exactly where your HTML files are
const publicPath = path.join(__dirname, '..');
app.use(express.static(publicPath));

// --- ROUTES ---

// 1. Landing Page - Force it to load Login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'Login.html'));
});

// 2. Registration
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, dueDate } = req.body;
    const sql = `INSERT INTO users (username, email, password, due_date) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email, password, dueDate], function(err) {
        if (err) return res.status(500).json({ error: "Signup Failed" });
        res.json({ message: "Success", userId: this.lastID, username: name });
    });
});

// 3. Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(sql, [email, password], (err, user) => {
        if (err || !user) return res.status(401).json({ error: "Invalid" });
        res.json({ message: "Success", userId: user.id, username: user.username });
    });
});

// 4. Save Profile
app.post('/api/profile/save', (req, res) => {
    const { userId, weeks, dueDate, babyName, age, height, weight, bloodGroup } = req.body;
    const sql = `INSERT INTO user_profiles (user_id, weeks_pregnant, due_date, baby_name, age, height, weight, blood_group) VALUES (?,?,?,?,?,?,?,?)`;
    db.run(sql, [userId, weeks, dueDate, babyName, age, height, weight, bloodGroup], function(err) {
        if (err) return res.status(500).json({ error: "Save Failed" });
        res.json({ message: "Saved" });
    });
});

// 5. Load Profile
app.get('/api/profile/:userId', (req, res) => {
    const sql = `SELECT * FROM user_profiles WHERE user_id = ? ORDER BY profile_id DESC LIMIT 1`;
    db.get(sql, [req.params.userId], (err, row) => {
        if (err) return res.status(500).json({ error: "Load Failed" });
        res.json(row ? [row] : []);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING: Go to http://localhost:${PORT}`);
});