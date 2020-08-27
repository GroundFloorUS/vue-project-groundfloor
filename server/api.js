const express = require('express')
const db = require('./db')
const { error } = require('npmlog')

let api = express.Router()

api.get('/funding', (req, res, next) => {
  db.all(
    `SELECT i.id, i.purpose, i.address, i.rate, i.expected_term_months, i.loan_amount_dollars, f.amount, sum(f.amount) as total_funded
      FROM investment i
      INNER JOIN funding f on i.id = f.investment_id
      GROUP BY i.id;
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
    `SELECT i.id, i.purpose, i.address, i.rate, i.expected_term_months,
          i.loan_amount_dollars, i.fully_funded, SUM(f.amount) as total_funded
      FROM investment i
      INNER JOIN funding f on i.id = f.investment_id
      AND i.id = ?
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
      FROM funding
      WHERE investment_id = ?`,
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
    `SELECT f.id, f.investment_id, f.created_on,
      i.loan_amount_dollars,
      sum(f.amount) as total_funded,
      (i.loan_amount_dollars - sum(f.amount)) as amount_til_funded
      FROM investment i, funding f
      WHERE i.id = ? AND i.id=f.investment_id
      GROUP by f.investment_id;`,
    [Number(req.params.id)],
    (err, row) => {
      if (err) {
        next(err)
      }

      res.json(row)
    }
  )
})

api.put('/fund', (req, res, next) => {
  let {
    id
  } = req.body

  db.run(
    `UPDATE investment
      SET fully_funded = 1
      WHERE id = ?;
      `,
    [Number(id)],
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
          `SELECT MAX(id) as id FROM investment`,
          [],
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
      [Number(investment_id), Number(amount)],
      err => {
        if (err) {
          next(err)
        }
        db.get(
          `SELECT id, investment_id, amount, created_on
           FROM funding
           WHERE rowid = ?`,
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
