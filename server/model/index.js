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

