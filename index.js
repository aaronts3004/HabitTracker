
// start locally by typing 'npm run start' in command-line

const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')


// import the database script
var db = require('./database.js');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true}));

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

// TODO: FIX
// POST a marking and a date, insert into database
app.post("/mark-habit", (req, res) => {
    console.log("Made POST request to mark-habit")
    const selectedHabitName = req.body.habitSelect;
    const notesOnHabit = req.body.habitNote;
    const date = req.body.date;

    const getHabitIdQuery = `SELECT id FROM habits WHERE name = ?`;
    
    db.run(getHabitIdQuery, [selectedHabitName], (err, row) => {
        if (err) {
            console.error('Error getting habit id', err.message);
            return res.status(500).json({ success: false, error: "Error marking habit." });
        }
        
        if (!row) {
            return res.status(404).json({ success: false, error: "Habit not found." });
        }

        const habitId = row.id;

        // Now insert the habit mark using the retrieved habit_id
        const insertMarkQuery = `INSERT INTO habit_marks (habit_id, date, notes) VALUES (?, ?, ?)`;
        db.run(insertMarkQuery, [habitId, date, notesOnHabit], function(err) {
            if (err) {
                console.error('Error inserting habit mark', err.message);
                return res.status(500).json({ success: false, error: "Error marking habit." });
            }
        });
    });

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

/* TODO: 

- add a form to add a new habit 
- add a form to edit an existing habit 
- work on the sidebar
- fix calendar dates

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
