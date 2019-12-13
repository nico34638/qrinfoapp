
'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: configDb.host,
  user: configDb.user,
  password: configDb.password,
  database: configDb.database,
});


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (client) => {
  // connexion du websocket au server
  client.on('socket connected', (data) => {
      console.log(data);
      connection.query('INSERT INTO info SET ?', data, (err, response) => {
          if(err) throw err;
          console.log('le Client est insérer');

        client.emit('socket connected', { response: "succees" })
        });
    });

    client.on('socket disconnected', (data) => {
      console.log(data);
      connection.query('DELETE FROM info WHERE name = ?', data.name ,(err, response) => {
              if(err) throw err;
              consol.log("le client est supprime")
              client.emit('socket disconnected', { response: "succees" })
            });
      });
});

io.on('disconnect', function () {
      socket.emit('disconnected');

  });
