const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const connectDB = () => {
    const dbPath = path.resolve(__dirname, '../../database.sqlite');
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('SQLite Connected: database.sqlite');
            
            // CREATE THE USERS TABLE IF IT DOESN'T EXIST
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                dueDate TEXT
            )`, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                } else {
                    console.log('Database tables initialized.');
                }
            });
        }
    });
    return db;
};

module.exports = connectDB;