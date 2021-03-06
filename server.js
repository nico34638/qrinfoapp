
'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const configDb = require('./config/configDb.json');
const {success, error} = require('./Lib/functions.js');

const connection = mysql.createConnection({
  host: configDb.host,
  user: configDb.user,
  password: configDb.password,
  database: configDb.database,
});


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');





// rest api

// Initialisation du router Content
let ContentRouter = express.Router()
ContentRouter.route('/api/content')
  // renvoie tout les content
  .get((req, res) => {
      connection.query("SELECT * FROM content", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.json(success(result));
      });
  })
  //ajput d'un content
  .post((req, res) => {
    if(req.body.title && req.body.content){
      console.log('ok')
      console.log(req.body)
      connection.query('INSERT INTO content SET ?', req.body, (err, response) => {
          if(err) throw err;
          console.log('le content est insérer');
        });
      res.json(success(req.body));
    }
    else{
      res.json(error('no name value'));
    }
  });

ContentRouter.route('/api/content/:id')
  // renvoie les content avec un id particluier
  .get((req, res) => {
      if(req.params.id)  {
        let id = req.params.id;
        let reqSql = 'SELECT * FROM content WHERE id = ?';
        connection.query(reqSql, id, function (err, result) {
          if (err) throw err;
          console.log(result);
          res.json(success(result));
        });
      }
      else{
        res.json(error('no name value'));
      }
    })
    // Supprimer les elements qui ont l'id envoyer en parametre
    .delete((req, res) => {
        let id = req.params.id;
        let reqSql = 'DELETE FROM content WHERE id = ?';
          connection.query(reqSql, id,function (err, result) {
            if (err) throw err;
            console.log("Number of records deleted: " + result.affectedRows);

          });

          connection.query("SELECT * FROM content", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.json(success(result));
          });
          
    })
// Init server
  const server = express()
    //.use((req, res) => res.sendFile(INDEX) )
    .use(morgan('dev'))
    .use(express.json())
    .use(ContentRouter)
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
