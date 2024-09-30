// Script to setup the database upon project configuration 
// Will be exported to the main NODE.js server script

const sqlite3 = require('sqlite3').verbose(); // Import sqlite3
const DBSOURCE = "./habits.db";

// Create or connect to the SQLite database (stored in 'habits.db')
const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create the table to store 'HABITS'
        db.run(`CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT,
            description TEXT
        )`);

        // Create the table to store marked dates for existing habits
        db.run(`CREATE TABLE IF NOT EXISTS habit_dates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER,
            date TEXT,
            notes TEXT,
            FOREIGN KEY(habit_id) REFERENCES habits(id)
        )`);
    }
});

// allow export of the database script
module.exports = db;