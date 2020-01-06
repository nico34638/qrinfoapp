
'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const configDb = require('./config/configDb.json');

const connection = mysql.createConnection({
  host: configDb.host,
  user: configDb.user,
  password: configDb.password,
  database: configDb.database,
});


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');





// rest api

let ArticleRouter = express.Router()
ArticleRouter.route('/api/content')
  // renvoie tout les membres
  .get((req, res) => {
      connection.connect(function(err) {
      if (err) throw err;
      connection.query("SELECT * FROM content", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
  });
  })




  const server = express()
    //.use((req, res) => res.sendFile(INDEX) )
    .use(morgan('dev'))
    .use(express.json())
    .use(ArticleRouter)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));


    const io = socketIO(server);
    // quand on se connecte
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

        //qunad on se deconnecte
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
