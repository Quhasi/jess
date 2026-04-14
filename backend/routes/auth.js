const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Connect to the same database file your db.js uses
const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

// --- REGISTRATION ROUTE ---
router.post('/register', (req, res) => {
    const { name, email, password, dueDate } = req.body;

    // 1. Check if the email already exists
    const checkUser = "SELECT * FROM users WHERE email = ?";
    
    db.get(checkUser, [email], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error during check" });
        }
        
        if (row) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // 2. Insert the new user
        const insertUser = `INSERT INTO users (name, email, password, dueDate) VALUES (?, ?, ?, ?)`;
        
        db.run(insertUser, [name, email, password, dueDate], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to create account" });
            }
            
            res.status(201).json({ 
                message: "Account created successfully!", 
                userId: this.lastID 
            });
        });
    });
});

// --- LOGIN ROUTE ---
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const findUser = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.get(findUser, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        
        if (!row) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Return user data (In a real app, you'd use a JWT token here)
        res.status(200).json({
            message: "Login successful",
            name: row.name,
            email: row.email,
            dueDate: row.dueDate
        });
    });
});

module.exports = router;