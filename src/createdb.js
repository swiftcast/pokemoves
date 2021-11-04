var sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./stats.db', (err) => {
    if (err) {
        console.log(err.message);
    }

    console.log('Connected to the database');
})

db.run('CREATE TABLE userstats(userid INTEGER NOT NULL PRIMARY KEY, count INTEGER NOT NULL)');

db.close((err) => {
    if (err) return console.error(err.message);
    else console.log("Closing connection");
})