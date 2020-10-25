const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbfile =
  process.env.NODE_ENV === 'test'
    ? path.resolve(__dirname, 'groundfloor_test.db')
    : path.resolve(__dirname, 'groundfloor.db')
let db = new sqlite3.Database(dbfile)

// NOTE:
// This looks nothing like our actual database schema. :)
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS investment (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      purpose TEXT NOT NULL,
      address TEXT NOT NULL,
      rate DOUBLE NOT NULL,
      expected_term_months INTEGER NOT NULL,
      loan_amount_dollars INTEGER NOT NULL,
      fully_funded BOOLEAN NOT NULL DEFAULT 0,
      created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`
  )
  db.run(
    `CREATE TABLE IF NOT EXISTS funding (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      investment_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(investment_id) REFERENCES investment(id)
    );`
  )
})

module.exports = db
