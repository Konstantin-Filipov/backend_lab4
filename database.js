const sqlite3 = require('sqlite3').verbose();
let sql;

// open database in memory
const db = new sqlite3.Database('./log.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the log file SQlite database.');
});

//uncomment to create table
sql = `CREATE TABLE users(userID TEXT PRIMARY KEY, name TEXT, role TEXT, password TEXT)`;
db.run(sql)


//uncomment to drop table
/* sql = `DROP TABLE users`
db.run(sql) */

// close the database connection
/* db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
 */

module.exports = db;