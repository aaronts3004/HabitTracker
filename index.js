
// start locally by typing 'npm run start' in command-line

const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')

// import the database script
var db = require('./database.js');

const app = express();          // Start the server
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));        // Tell the server to look into the 'public' folder for static files
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());


// Homepage
app.get("/", (req,res) => {
    console.log("Made GET request to home");
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch all registered habits from database
app.get('/api/habits', async (req, res) => {
    try {
        // const names = {};
        const query = `SELECT name, color FROM habits`;

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error fetching habit names', err.message);
                return res.status(500).send('Error fetching habit names.');
            }
            const habits = rows.map(row => ({
                name: row.name,
                color: row.color
            }));

            // names.habits = rows.map(row => row.name);
            console.log("At API collected: ");
            console.log(habits);
            res.json(habits);
        });
    } catch (error) {
        console.error('Error fetching habits:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Returns color for the input habitName
app.get("/api/habits/:habitName/color", (req, res) => {
    console.log("Called habitName API for color!")
    // Extract the habit name from the request parameters
    const habitName = req.params.habitName;

    // Example query to fetch habit details based on the name
    const query = `SELECT color FROM habits WHERE name = ?`;

    db.get(query, [habitName], (err, row) => {
        if (err) {
            console.error('Error fetching habit at API:', err.message);
            return res.status(500).json({ error: 'Error fetching habit' });
        }

        if (row) {
            console.log("Backend get-color query returned: ")
            console.log(row);
            res.json(row); // Send back the habit details if found
        } else {
            res.status(404).json({ message: 'Habit not found in database when fetching color' });
        }
    });
});

// POST new habit and insert into database
app.post("/new-habit", (req, res) => {
    console.log("Made POST request to Add new habit")

    // Extract body request and insert fields into database
    const name = req.body.habitName;
    const color = req.body.habitColor;
    const descr = req.body.habitDescription;

    db.run(`INSERT INTO habits (name, color, description) VALUES (?, ?, ?)`, [name, color, descr], function(err) {
        if (err) {
            console.error('Error inserting habit', err.message);
            return res.status(500).send("Error adding habit.");
        }
    });
    res.redirect("/"); 
});

// POST a marking and a date, insert into database
app.post("/mark-habit", (req, res) => {
    const selectedHabitName = req.body.name;
    const notesOnHabit = req.body.notes;
    const date = req.body.date;

    const getHabitIdQuery = `SELECT id FROM habits WHERE name = ?`;
    var params = [selectedHabitName]
    
    let habitId;
    db.get(getHabitIdQuery, params, (err, row) => {
        if (err) {
            console.error('Error getting habit id', err.message);
            return res.status(500).json({ success: false, error: "Error marking habit." });
        } else if (!row) {
            console.log("--- Habit not found --- was: " + selectedHabitName);
            return res.status(404).json({ success: false, error: "Habit not found." });
        }
        habitId = row.id;
    });

    // Now insert the habit mark using the retrieved habit_id 
    const insertMarkQuery = `INSERT INTO habit_dates (habit_id, date, notes) VALUES (?, ?, ?)`;
    db.run(insertMarkQuery, [habitId, date, notesOnHabit], function(err) {
        if (err) {
            console.error('Error inserting habit mark into dates calendar', err.message);
            return res.status(500).json({ success: false, error: "Error marking habit." });
        }
    });

    console.log("Successfully inserted habit posting into database");

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

/* TODO: 


- long-term
    - add yearly overview
    - add buttons to move between months
    - add ability to mark a whole week at once (for habits that are to be done every day)
*/ 


// Test after insertion
/*
let sql = `SELECT * FROM habits`;

db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row);
    })
})
*/
