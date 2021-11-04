var sqlite3 = require('sqlite3').verbose();

var db = null;

function connectToDb () {

    db = new sqlite3.Database('./stats.db', (err) => {
    if (err) {
        console.log(err.message);
    }

    console.log('Connected to the database');
});
};
//var userid = 0;
//var hits = 0;

//db.run('CREATE TABLE userstats(userid INTEGER NOT NULL PRIMARY KEY, count INTEGER)');

// UPSERT

function insertUser(user, count) {
    let sql = `INSERT INTO userstats (userid, count) VALUES(?,?)
        ON CONFLICT(userid) DO UPDATE SET count=count+1`

    db.run(sql, [user,count], function (err) {
        if (err) {
            console.log(err.message);
        }
        else
            console.log(`Wrote to database new row ${user}:${count} `);
    });

    //closeDb();
};

function printTable() {

    db.all("SELECT * FROM userstats", [], (err, rows) => {
        if (err) return console.error(err.message);
        else
        rows.forEach((row) => {
            console.log(row);
        });
    });

    //closeDb();
};



function closeDb() {
    db.close((err) => {
        if (err) return console.error(err.message);
        else console.log("Closing connection");
    })
};

//insert(userid,hits);
//printTable();

module.exports = {connectToDb,insertUser,printTable, closeDb};

// ONLY USED FOR EMERGENCIES
//db.run('DROP TABLE stats');

//connectToDb();
//printTable();
//closeDb();