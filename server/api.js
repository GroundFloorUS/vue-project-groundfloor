const express = require('express')
const db = require('./db')

let api = express.Router()

api.get('/funding', (req, res, next) => {
  db.all(
    `SELECT i.*, SUM(f.amount) as funded_amt
      FROM investment i LEFT JOIN funding f
	    ON i.id = f.investment_id
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
    `SELECT * FROM investment
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
    `SELECT id, purpose, address, rate, expected_term_months, loan_amount_dollars,
                  fully_funded, created_on
           FROM investment WHERE id = ?`,
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
      err => {
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
      `SELECT i.loan_amount_dollars, SUM(f.amount) as funded_amt
      FROM investment i LEFT JOIN funding f
      ON i.id = f.investment_id
      WHERE i.id = ?
      GROUP BY i.id`,
      [investment_id],
      (err, row) => {
        if (err) {
          next(err)
        }
        let funded_amt = Number(row.funded_amt)
        let loan_amount_dollars = Number(row.loan_amount_dollars)
        let amountNumber = Number(amount)
        if (loan_amount_dollars < ((funded_amt || 0) + amountNumber)) {
          res.json({error: true, message: 'This will over fund the loan', maxAmt: row.loan_amount_dollars - (funded_amt || 0)})
        } else {
          db.run(
            `INSERT INTO funding
              (investment_id, amount)
              VALUES (?, ?);
            `,
            [investment_id, amount],
            err => {
              if (err) {
                next(err)
              }
              db.get(
                `SELECT i.loan_amount_dollars, SUM(f.amount) as funded_amt
                FROM investment i LEFT JOIN funding f
                ON i.id = f.investment_id
                WHERE i.id = ?
                GROUP BY i.id`,
                [investment_id],
                (err, row) => {
                  if (err) {
                    next(err)
                  }
                  if (row.loan_amount_dollars <= row.funded_amt) {
                    db.run(
                      `UPDATE investment
                        SET fully_funded = 1
                        WHERE id = ?
                      `,
                      [investment_id],
                      err => {
                        if (err) {
                          next(err)
                        }
                      }
                    )
                  }
                  res.json({...row, error: false})
                }
              )
            }
          )
        }
      }
    )
  })
})

module.exports = api
