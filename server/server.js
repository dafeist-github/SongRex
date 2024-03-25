const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.post("/submit", (req, res) => {
    console.log("Song-Request received");
    const name = req.body.name;
    const link = req.body.link;

    if(link.length <= 20 || !(link.startsWith('https://') || link.startsWith('http://')) || !link.includes('.') || name.length <= 5) {
        res.status(400);
        return;
    }

    processSongRequest(name, link, res);

    res.status(200).send('success');
    
});



const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'SongRex'
  });

  con.connect();

  console.log('Connected to MySQL-Server');
  
  con.query("CREATE TABLE IF NOT EXISTS songs (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), link VARCHAR(100), count INT)", function(err, result) {
    if(err) throw err;
        console.log("Found table: songs");
  });

  con.query("CREATE TABLE IF NOT EXISTS accounts (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), password VARCHAR(255), email VARCHAR(100))", function(err, result) {
    if(err) throw err;
        console.log("Found table: accounts");
  });

app.listen(3000);

app.post('/auth', function(request, response) {

	let username = request.body.username;
	let password = request.body.password;

	if (username && password) {

		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {

			if (error) throw error;

			if (results.length > 0) {

				request.session.loggedin = true;
				request.session.username = username;

				response.redirect('/manage');
			} else {
				response.send('invalid_name_or_pw');
			}			
			response.end();
		});
	} else {
		response.send('no_name_or_pw');
		response.end();
	}
});

app.get('/manage', function(request, response) {

	if (request.session.loggedin) {
		response.send('success, uname: ' + request.session.username);
	} else {
		response.send('not_authed');
	}
	response.end();
});

async function processSongRequest(name, link, res) {
    let exists = false;

    const result = await new Promise((resolve, reject) => {
        con.query("SELECT * FROM songs WHERE name = ?", [name], function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });

    if (result.length > 0) {
        await new Promise((resolve, reject) => {
            con.query("UPDATE songs SET count = count + 1 WHERE name = ?", [name], function (err, result) {
                if (err) reject(err);
                console.log("Updated count for Song " + name + ", Song already exists in DB");
                exists = true;
                resolve();
            });
        });
    }

    if (!exists) {
        await new Promise((resolve, reject) => {
            con.query("INSERT INTO songs (name, link, count) VALUES (?, ?, 1)", [name, link], function (err, result) {
                if (err) reject(err);
                console.log('Successfully added Song ' + name);
                resolve();
            });
        });
    }
}
