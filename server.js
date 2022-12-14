const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);


// apis
app.get('/api/notes', (req, res) => {
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
        if (error) {
          return console.log(error)
        }
        console.log("This is Notes", data)
        res.json(JSON.parse(data))
    })
});

app.post('/api/notes', (req, res) => { 
    const { title, text } = req.body;

    // read JSON object from file
    fs.readFile(__dirname + "/db/db.json", 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        // parse JSON object
        const notes = JSON.parse(data.toString());

        notes.push({
            "id": uuid(),
            title, 
            text
        });
        
        // print JSON object
        console.log(notes);
        
        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), function (error, data) {
            if (error) {
              return error
            }
            console.log(notes)
            res.json(notes);
        })

    });
});

app.delete("/api/notes/:id", function (req, res) {
    
    const noteId = req.params.id

    fs.readFile(__dirname + "/db/db.json", 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        // parse JSON object
        const notes = JSON.parse(data.toString());

        const index = notes.findIndex(x => x.id === noteId);

        if (index !== undefined) notes.splice(index, 1);

        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), function (error, data) {
            if (error) {
              return error
            }
            console.log(notes)
            res.json(notes);
        })

    });

});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(process.env.PORT || PORT, 
	() => console.log("Server is running... ????"));
    