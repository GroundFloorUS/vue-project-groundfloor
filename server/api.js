const express = require('express')
const db = require('./db')

let api = express.Router()

api.get('/funding', (req, res, next) => {
  db.all(
    `SELECT * FROM investment
       WHERE fully_funded = 0
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
          `SELECT id, investment_id, amount, created_on
           FROM funding WHERE rowid = ?`,
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

// Verify if we use a new /fund or existing /fundings
api.post('/fund', (req, res, next) => {
  let { investment_id, amount } = req.body
  // TODO:
  // Change the /api/fund endpoint so that it checks if a fund has been fully funded. Reject a new investment if it's too much for that loan.
  // Change the /api/fund endpoint so that if it fully funds a loan, it sets the db record's investment.fully_funded to 1. Then it will appear on the FUNDED screen.

  db.serialize(() => {
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
          `SELECT id, investment_id, amount, created_on
           FROM funding WHERE rowid = ?`,
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

module.exports = api
