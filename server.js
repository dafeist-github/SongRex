import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import { handler } from './svelte/build/handler.js';
import argon2 from 'argon2';

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
const regex = new RegExp(expression);

const secretKey = process.env.SECRET_KEY || 'examplekey';
let iplist = [];

app.post("/submit", (req, res) => {
    const name = req.body.name;
    const link = req.body.link;

    var senderip;

    if(process.env.X_FORWARD_ENABLED) {
        senderip = req.headers['x-forwarded-for'];
    } else {
        senderip = req.socket.remoteAddress;
    }

    if(!senderip) {
        res.status(500);
        return;
    }


    if(iplist.includes(senderip)) {
        res.status(400).send({ratelimit: true});
        return;
    }
    iplist.push(senderip);

    console.log("Song-Request received: " + name);

    if (!link.match(regex)) {
        res.status(400);
        return;
    }

    processSongRequest(name, link, res);

    res.status(200).send({'success': 'true'});

    setTimeout(function() {
        
        var index = iplist.indexOf(senderip);

        iplist.splice(index, 1);
      }, 6000);

});

var con = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'examplepw',
    database: process.env.MYSQL_DATABASE || 'SongRex'
});

con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
  
function handleDisconnect() {
    con = mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'example_pw',
        database: process.env.MYSQL_DATABASE || 'SongRex'
    });

    con.connect();
  
  }

con.connect();

console.log('Connected to MySQL-Server');

con.query("CREATE TABLE IF NOT EXISTS songs (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), link VARCHAR(255), count INT)", function (err, result) {
    if (err) throw err;
    console.log("Found table: songs");
});

con.query("CREATE TABLE IF NOT EXISTS accounts (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), password VARCHAR(255), email VARCHAR(100))", function (err, result) {
    if (err) throw err;
    console.log("Found table: accounts");
});

const adminpwhash = await argon2.hash(process.env.ADMIN_PASSWORD || "example_pw");

con.query('INSERT INTO accounts (id, username, password, email) VALUES (1, "admin", ?, "example@domain.com") ON DUPLICATE KEY UPDATE password = ?', [adminpwhash, adminpwhash], function (error, results, fields) {
    if(error) console.log(error);

    console.log('Prepared Admin-Account');
});

app.listen(3000);

app.get('/healthcheck', (req, res) => {
    res.end('ok');
  });

app.post('/reqdata', function (request, response) {

    let username = request.body.username;
    let token = request.body.token;
    
    if(!request.body.username || !request.body.token || !verifyRequest(username, token)) {
        response.status(401).send({auth: false});
        return;
    }

    con.query('SELECT * FROM songs', function(error, results) {

        var jsonArr = [];
    
        for (var i = 0; i < results.length; i++) {
            jsonArr.push({
                id: results[i].id,
                name: results[i].name,
                link: results[i].link
            });
        }

        response.send(jsonArr); 
    
    });

});

app.post('/deletesong', function (request, response) {
    if(!verifyRequest(request.body.username, request.body.token)) {
        response.status(401).send({auth: false});
        return;
    }

    const sname = request.body.songname;
    const slink = request.body.songlink;

    con.query("DELETE FROM songs WHERE name = ? AND link = ?", [sname, slink], function (err, result) {
        if (err) return;
        response.status(200).send({done: true});
        console.log("Deleted Song: " + sname);
    });

});

app.post('/auth', function (request, response) {

    let username = request.body.username;
    let password = request.body.password;

    if (username && password) {


        con.query('SELECT password FROM accounts WHERE username = ?', [username], function (error, results, fields) {
            if (error || results.length == 0) {
                response.status(400).send('invalid_name_or_pw');

                return;
            }

            argonverify(results[0].password, password).then((b) => {
                if(b) {
                    console.log("Successful Login for Account: " + username);
                    response.send({ token: generateToken(username) });
                } else {
                    response.status(400).send('invalid_name_or_pw');
                }

                response.end();
            });

        });

    } else {
        response.status(400).send('no_name_or_pw');
        response.end();
    }

});

app.post('/validate', function (request, response) {

    if (verifyRequest(request.body.username, request.body.token)) {
        response.send({ auth: true });
    } else {
        response.send({ auth: false });
    }

    response.end();
});

app.use(handler);

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
    if(verifyToken(token)) {
    if (username === verifyToken(token).username) return true;
    } else {
    return false;
    }
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (err) {
        return null;
    }
}

function argonverify(a, password) {
    try {
        const hash = argon2.verify(a, password);

        return hash;
    } catch (err) {
        console.log("ERROR: " + err);
    }
}