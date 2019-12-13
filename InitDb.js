const mysql = require('mysql');
const configDb = require('./config/configDb.json');

console.log(configDb);
// connection a la base de données
const connection = mysql.createConnection({
  host: configDb.host,
  user: configDb.user,
  password: configDb.password,
  database: configDb.database,
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  // cretation de la table
  let table = "CREATE TABLE info (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), connection_id INT)";
  connection.query(table, function (err, result) {
    if (err) throw err;
    console.log("Table info has been created");
  });

  // Ajout des contraintes pour avoir un connection_id uniq
  let alter = "ALTER TABLE info ADD UNIQUE(connection_id)";
  connection.query(alter, function (err, result) {
    if (err) throw err;
    console.log("Table info has bee Alter");
  });

  // Ajout des contraintes pour avoir un nom uniq
  let alterName = "ALTER TABLE info ADD UNIQUE(name)";
  connection.query(alterName, function (err, result) {
    if (err) throw err;
    console.log("Table info has bee Alter");
    process.exit();
  });
});

console.log('finished');
