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
  db.serialize(() => {
    db.get(
      `SELECT id, purpose, address, rate, expected_term_months, loan_amount_dollars,
                  fully_funded, created_on
           FROM investment WHERE id = ?`,
      [Number(req.params.id)],
      (err, row) => {
        if (err) {
          next(err)
        }
        db.all(
          `SELECT id, investment_id, amount, created_on
           FROM funding WHERE investment_id = ?`,
          [Number(req.params.id)],
          (err, funds) => {
            if (err) {
              next(err)
            }

            // calculate loan amount
            let loanAmtFunded = funds.reduce((t, i) => t + i.amount, 0)
            row.loanAmtFunded = loanAmtFunded
            row.isLoanFullyFunded = loanAmtFunded >= row.loan_amount_dollars
            res.json(row)
          }
        )
        // res.json(row)
      }
    )
  })
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
          function(err, row) {
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
  let loanAmt
  let totalFunds
  let currentLoanAmtFunded
  let fundId
  let insertedRow

  // TODO:
  // Change the /api/fund endpoint so that it checks if a fund has been fully funded. Reject a new investment if it's too much for that loan.
  // Change the /api/fund endpoint so that if it fully funds a loan, it sets the db record's investment.fully_funded to 1. Then it will appear on the FUNDED screen.
  new Promise((resolve, reject) => {
    db.get(
      `SELECT id, purpose, address, rate, expected_term_months, loan_amount_dollars,
                    fully_funded, created_on
            FROM investment WHERE id = ?`,
      [Number(investment_id)],
      (err, row) => {
        if (err) reject({ status: 500, error: err })

        // Change the /api/fund endpoint so that it checks if a fund has been fully funded. Reject a new investment if it's too much for that loan.
        if (row.fully_funded || amount > row.loan_amount_dollars) {
          reject({
            status: 400,
            error:
              'Fund has been fully funded or new investment is too much for the loan'
          })
        }

        loanAmt = row.loan_amount_dollars
        resolve(row)
      }
    )
  })
    .then(investment => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT id, investment_id, amount, created_on
           FROM funding WHERE investment_id = ?`,
          [Number(investment_id)],
          function(err, funds) {
            if (err) reject({ status: 500, error: err })

            // calculate loan amount
            currentLoanAmtFunded = funds.reduce((t, i) => t + i.amount, 0)
            let possibleLoanAmtFunded =
              Number(amount) + Number(currentLoanAmtFunded)

            if (possibleLoanAmtFunded > loanAmt) {
              reject({
                status: 400,
                error: 'Fund amount is too much for the loan'
              })
            }
            resolve(investment)
          }
        )
      })
    })
    .then(investment => {
      return new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO funding
          (investment_id, amount)
        VALUES (?, ?);
        `,
          [investment_id, amount],
          function(err) {
            if (err) reject({ status: 500, error: err })

            fundId = this.lastID
            resolve(fundId)
          }
        )
      })
    })
    .then(fundId => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT id, investment_id, amount, created_on
        FROM funding WHERE investment_id = ?`,
          [Number(investment_id)],
          function(err, rows) {
            if (err) reject({ status: 500, error: err })

            totalFunds = rows.reduce((t, i) => t + i.amount, 0)
            insertedRow = rows.find(r => r.id === fundId)
            resolve(rows)
          }
        )
      })
    })
    .then(funds => {
      let isFullyFunded = totalFunds >= loanAmt ? true : false

      if (isFullyFunded) {
        return new Promise((resolve, reject) => {
          db.run(
            `UPDATE investment
          SET fully_funded = ?
          WHERE id = ?`,
            [true, Number(investment_id)],
            function(err) {
              if (err) {
                reject({
                  status: 500,
                  error:
                    "Cannot set the db record's investment.fully_funded to 1"
                })
              }

              // Reject a new investment if it's too much for that loan.
              if (totalFunds > loanAmt) {
                reject({
                  status: 400,
                  error: 'new investment is too much for the loan'
                })
              }
              resolve(insertedRow)
            }
          )
        })
      } else {
        return Promise.resolve(insertedRow)
      }
    })
    .then(insertedRow => {
      res.json(insertedRow)
    })
    .catch(function({ status, error }) {
      res.status(status).end(error)
    })
})

module.exports = api
