
'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toor',
  database: 'qrinfo',
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
          console.log('db insert : OK');

        client.emit('socket connected', { response: "succees" })
        });
    });

    client.on('socket disconnected', (data) => {


      console.log(data);
      connection.query('DELETE FROM info WHERE ?', info, (err, response) => {
              if(err) throw err;
              console.log('le post est supprimer db');
              console.log('le client est deconnecte');
            });


          });
          //ALTER TABLE `info` ADD UNIQUE(`connection_id`);
});
