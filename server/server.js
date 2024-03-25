const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const secretKey = "testkey";

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

		con.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {

			if (error) throw error;

			if (results.length > 0) {

                console.log("Successful Login for Account: " + username);
                response.send({token: generateToken(username)});

			} else {
				response.status(400).send('invalid_name_or_pw');
			}			
			response.end();
		});
	} else {
		response.status(400).send('no_name_or_pw');
		response.end();
	}
});

app.post('/validate', function(request, response) {

	if (verifyRequest(request.body.username, request.body.token)) {
		response.send({auth: true});
	} else {
		response.send({auth: false});
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

function generateToken(username) {
    return jwt.sign({ username: username }, secretKey, { expiresIn: '24h' });
}

function verifyRequest(username, token) {
    if(username === verifyToken(token).username) return true;
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (err) {
        return null;
    }
}