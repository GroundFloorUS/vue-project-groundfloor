const express = require('express')
const db = require('./db')

let api = express.Router()

api.get('/funding', (req, res, next) => {
  db.all(
    `SELECT *,sum(total) as sum FROM investment 
    Left join (select SUM(amount) as total,investment_id from funding GROUP BY id) as fnd on (investment.id = fnd.investment_id)
    WHERE fully_funded = 0 GROUP BY id ORDER BY created_on DESC  
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
    `SELECT id, purpose, address, rate, expected_term_months, loan_amount_dollars, fully_funded, created_on, sum(total) as sum
    FROM investment 
    Left join (select SUM(amount) as total,investment_id from funding GROUP BY id) as fnd on (investment.id = fnd.investment_id)
    WHERE id = ?`,
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

  db.get(
    `SELECT id, loan_amount_dollars, sum(total) as sum
    FROM investment 
    Left join (select SUM(amount) as total,investment_id from funding GROUP BY id) as fnd on (investment.id = fnd.investment_id)
    WHERE id = ?`,
    [Number(investment_id)],
    (err, row) => {
      let nextSum = row.sum*1 + amount*1;
      if (err) {
        next(err)
      }else if(nextSum > row.loan_amount_dollars*1){
        //return error here that it's too much money
        next({code: "AMOUNT_EXCEEDED_ERROR",errno: 1})
      }else if(nextSum == row.loan_amount_dollars*1){
        //set the investment to fully funded
        db.run(
          `update investment 
           set fully_funded = 1
           where id = ? 
          `,[Number(investment_id)],
          (err, rows) => {
            if (err) {
              next(err)
            }
            addFund(investment_id, amount);
          }
        )
      }else{
        addFund(investment_id, amount);
      } 
    }
  )
  function addFund(investment_id, amount){
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
  }

  /*
  
  */
})

module.exports = api
