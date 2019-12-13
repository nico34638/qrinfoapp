const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toor',
  database: 'qrinfo',
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let table = "CREATE TABLE info (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), connection_id INT)";
  connection.query(table, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  let alter = "ALTER TABLE info ADD UNIQUE(connection_id)";
  connection.query(alter, function (err, result) {
    if (err) throw err;
    console.log("Table Alter");
  });

  let alter = "ALTER TABLE info ADD UNIQUE(name)";
  connection.query(alter, function (err, result) {
    if (err) throw err;
    console.log("Table Alter");
  });

});
