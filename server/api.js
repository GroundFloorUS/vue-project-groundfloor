const express = require('express')
const db = require('./db')

let api = express.Router()

api.get('/funding', (req, res, next) => {
  db.all(
    `SELECT i.*,
       SUM(f.amount) AS total_funding,
       COUNT(f.id) AS num_funders
       FROM investment i
       LEFT JOIN funding f ON i.id = f.investment_id
       WHERE i.fully_funded = 0
       GROUP BY i.id
       ORDER BY i.created_on DESC
    `,
    (err, rows) => {
      if (err) {
        next(err)
      }
      return res.json(rows)
    }
  )
})

api.get('/funded', (req, res, next) => {
  db.all(
    `SELECT *
       FROM investment
       WHERE fully_funded = 1
       ORDER BY created_on DESC
    `,
    (err, rows) => {
      if (err) {
        next(err)
      }
      return res.json(rows)
    }
  )
})

api.get('/investment/:id', (req, res, next) => {
  db.get(
    `SELECT i.*,
       SUM(f.amount) AS total_funding
       FROM investment i
       LEFT JOIN funding f ON i.id = f.investment_id
       WHERE i.id = ?
       GROUP BY i.id`,
    [Number(req.params.id)],
    (err, row) => {
      if (err) {
        next(err)
      }

      res.json(row)
    }
  )
})

api.get('/investment/:id/funds', (req, res, next) => {
  db.all(
    `SELECT id, investment_id, amount, created_on
           FROM funding WHERE investment_id = ?`,
    [Number(req.params.id)],
    (err, rows) => {
      if (err) {
        next(err)
      }

      res.json(rows)
    }
  )
})

api.get('/fund/:id', (req, res, next) => {
  db.get(
    `SELECT id, investment_id, amount, created_on
           FROM funding WHERE id = ?`,
    [Number(req.params.id)],
    (err, row) => {
      if (err) {
        next(err)
      }

      res.json(row)
    }
  )
})

api.post('/investment', (req, res, next) => {
  let {
    purpose,
    address,
    rate,
    expected_term_months,
    loan_amount_dollars
  } = req.body

  db.serialize(() => {
    db.run(
      `INSERT INTO investment 
        (purpose, address, rate, expected_term_months, loan_amount_dollars)
       VALUES (?, ?, ?, ?, ?);
      `,
      [purpose, address, rate, expected_term_months, loan_amount_dollars],
      function(err) {
        if (err) {
          next(err)
        }
        db.get(
          `SELECT id, purpose, address, rate, expected_term_months, loan_amount_dollars,
                  fully_funded, created_on
           FROM investment WHERE rowid = ?`,
          [this.lastID],
          (err, row) => {
            if (err) {
              next(err)
            }
            res.json(row)
          }
        )
      }
    )
  })
})

api.post('/funding', (req, res, next) => {
  let { investment_id, amount } = req.body

  db.serialize(() => {
    db.get(
      `SELECT i.loan_amount_dollars,
       SUM(f.amount) AS total_funding
       FROM investment i
       LEFT JOIN funding f ON i.id = f.investment_id
       WHERE i.id = ?
       GROUP BY i.id`,
       [investment_id],
       function(err, row) {
         if (err) {
          next(err)
         } else {
          let amount_needed = row.loan_amount_dollars - row.total_funding
          if (amount > amount_needed) {
            res.json({ error: 'Amount is greater than needed' })
            res.end()
          } else {
            // correct amount, now insert
            db.run(
              `INSERT INTO funding
                (investment_id, amount)
               VALUES (?, ?);
              `,
              [investment_id, amount],
              function(err) {
                if (err) {
                  next(err)
                }
                db.run(
                  `UPDATE investment SET fully_funded = (
                    SELECT CASE WHEN SUM(amount) = loan_amount_dollars THEN 1 ELSE 0 END FROM funding WHERE investment_id = ?
                   )
                   WHERE id = ?;
                  `,
                  [investment_id, investment_id]
                )
                db.get(
                  `SELECT id, investment_id, amount, created_on
                   FROM funding WHERE id = ?`,
                  [this.lastID],
                  (err, row) => {
                    if (err) {
                      next(err)
                    }
                    res.json(row)
                  }
                )
              }
            )
          }
         }
       }
    )
  })
})

// remove from final git pull request
api.get('/reset', (req, res, next) => {
  let invs = [
    { id: 1,
      purpose: "Purchase",
      address: "987 First st, Auburn, AL, 36830",
      rate: 15,
      expected_term_months: 24,
      loan_amount_dollars: 50000,
      fully_funded: 0
    },
    { id: 2,
      purpose: "Renovate",
      address: "123 Main ST, Atlanta, GA, 30360",
      rate: 10,
      expected_term_months: 24,
      loan_amount_dollars: 100000,
      fully_funded: 0
    },
    { id: 3,
      purpose: "Flippity Flip",
      address: "555 Park Ave, New York, NY, 10555",
      rate: 5,
      expected_term_months: 18,
      loan_amount_dollars: 300000,
      fully_funded: 1
    }
  ]
  let funds = [
    { investment_id: 1, amount: 100 },
    { investment_id: 1, amount: 1000 },
    { investment_id: 2, amount: 200 },
    { investment_id: 2, amount: 2000 },
    { investment_id: 3, amount: 10000 },
    { investment_id: 3, amount: 30000 },
    { investment_id: 3, amount: 260000 },
  ]
  db.serialize(() => {
    db.run('DELETE FROM investment')
      .run('DELETE FROM funding')
    
    for (let i of invs) {
      let {
        id,
        purpose,
        address,
        rate,
        expected_term_months,
        loan_amount_dollars,
        fully_funded
      } = i
      db.run(
      `INSERT INTO investment 
        (id, purpose, address, rate, expected_term_months, loan_amount_dollars, fully_funded)
       VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [id, purpose, address, rate, expected_term_months, loan_amount_dollars, fully_funded],
      function(err) { console.log('insert investment err', err, this.lastID, this.changes) })
    }
    for (let f of funds) {
      let {
        investment_id,
        amount
      } = f
      db.run(
      `INSERT INTO funding
        (investment_id, amount)
       VALUES (?, ?);
      `,
      [investment_id, amount],
      function(err) { console.log('insert funding err', err, this.lastID, this.changes) })
    }
    res.end()
  })
})

module.exports = api
