const express = require('express');
const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//Routes

// API GET Requests
app.get('/api/notes', (req, res) => {

    fs.readFile('./db/db.json', 'utf8', (err, data) => {

        if(err) throw err;
        let notes = JSON.parse(data);
        res.json(notes);

    });

});

// API POST Requests
app.post('/api/notes', (req, res) => {

    let newNote = req.body;
    // Adding a unique id to the note using uuid package
    newNote.id = uuidv4();
    fs.readFile('./db/db.json', 'utf8', (err, data) => {

        if(err) throw err;
        let notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), err => {

            if(err) throw err;
            res.json(newNote);
            console.log("Your note was saved!")

        });

    });

});

// Bonus: API DELETE Requests
app.delete('/api/notes/:id', (req, res) => {

    let noteId = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {

        if(err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), err => {

            if(err) throw err;
            res.json(notes);
            console.log(`Note with id ${noteId} has been deleted!`);

        });

    });

});

// HTML GET Requests
app.get('/notes', (req, res) => {

    res.sendFile(path.join(__dirname, './public/notes.html'));

});

app.get('*', (req, res) => {

    res.sendFile(path.join(__dirname, './public/index.html'));

});

// Listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));