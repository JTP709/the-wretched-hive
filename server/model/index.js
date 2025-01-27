const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, './ecommerce.db');

const connectToDatabase = (app) => {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to database', err);
    } else {
      console.log('Connected to database');
      app.listen(4000, () => {
        console.log('Server is running on port 4000');
      });
    }
  });

  const query = `
    SELECT name 
    FROM sqlite_master 
    WHERE type='table' 
    ORDER BY name;
  `;

  db.all(query, (err, rows) => {
    if (err) console.error(err);
    else rows.forEach((row) => {
      console.log(row.name);
    });
    console.log({rows})
  });

  process.on('exit', () => {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Closed the database connection.');
      }
    });
  });

  return db;
}

module.exports = connectToDatabase;

