const express = require('express')
const db = require('./db')

const { validateAddress, validateRate, validateLoanAmount, validateFundingAmount } = require('../common/validations')

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

api.post('/investment', async (req, res, next) => {
  let {
    purpose,
    address,
    rate,
    expected_term_months,
    loan_amount_dollars
  } = req.body

  // ADDRESS
  const is_valid_address = validateAddress(address)
  // RATE
  const is_valid_rate = validateRate(rate)
  // LOAN AMOUNT DOLLARS
  const is_valid_amount = validateLoanAmount(loan_amount_dollars)

  if (!is_valid_address || !is_valid_amount || !is_valid_rate) {
    res.status(403).send('Address, Rate or Loan Amount is invalid.')
  }

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

const getInvestment = (id) => {
  return new Promise((resolve, reject) => {
    try {
      db.get(`SELECT id, fully_funded, loan_amount_dollars 
      FROM investment 
      WHERE id = ?;`, id, (err, row) => {
        if (err) {
          reject(err)
        }
        resolve(row)
      });
    } catch (error) {
      reject(error)
    }
  })
}

const sumFunds = (id) => {
  return new Promise((resolve, reject) => {
    try {
      db.get(`SELECT SUM(amount) AS summed_amount
      FROM funding 
      WHERE investment_id = ?;`, id, (err, row) => {
        if (err) {
          reject(err)
        }
        resolve(row)
      });
    } catch (error) {
      reject(error)
    }
  })
}

const insertFunding = (investment_id, amount) => {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `INSERT INTO funding
        (investment_id, amount)
        VALUES (?, ?);
      `, [investment_id, amount], function (err) {
        if (err) {
          reject(err)
        }
        resolve(this.lastID)
      }
      )
    } catch (error) {
      reject(error)
    }
  })
}

const getLastFund = (id) => {
  return new Promise((resolve, reject) => {
    try {
      db.get(`SELECT id, amount, created_on 
      FROM funding 
      WHERE id = ?;`, id, function (err, row) {
        if (err) {
          reject(err)
        }
        resolve(row)
      });
    } catch (error) {
      reject(error)
    }
  })
}

const runIsFunded = (investment_id) => {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `UPDATE investment
        SET fully_funded = 1;
      `, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      }
      )
    } catch (error) {
      reject(error)
    }
  })
}

api.post('/funding', (req, res, next) => {
  let { investment_id, amount } = req.body
  amount = Number(amount)
  const is_valid_funding_amount = validateFundingAmount(amount)
  if (!is_valid_funding_amount) {
    res.status(403).send('Invalid Amount.')
  }
  db.serialize(async () => {
    // TODO : TURN THIS INTO A STORED PROCEDURE!  -   ;)

    // GET INFO ABOUT LOAN
    const loan = await getInvestment(investment_id)
    // SUM THE FUNDS
    const summedFunds = await sumFunds(investment_id)
    const sum = summedFunds && summedFunds.summed_amount ? summedFunds.summed_amount : 0; // SEEMS THAT IF SUM IS 0 THEN THE RESULT IS RETURNED AS NULL
    const leftToFund = loan.loan_amount_dollars - sum;
    console.log(leftToFund, amount, leftToFund < amount)
    // IF THE LOAN AMOUNT PLUS THE NEW AMOUNT IS GREATER THAN THE SUMMED FUNDS THEN REJECT (CAN'T GO OVER)
    if (leftToFund < amount) {
      res.json({
        amount: 0,
        error: `Fund Amount is too much for loan. $${leftToFund} is remaining.`
      })
      return
    }

    // INSERT AMOUNT INTO FUNDS
    const insertIntoFunds_id = await insertFunding(investment_id, amount)
    // GET LAST ROW OF FUNDS
    const lastFundResult = await getLastFund(insertIntoFunds_id)

    let fullyFunded = false;
    // IF THE SUM OF THE FUNDS + THE AMOUNT + LOAN AMOUNT THEN MARK AS FUNDED
    if ((sum + amount) === loan.loan_amount_dollars) {
      const isFunded = await runIsFunded(investment_id)
      fullyFunded = true
    }
    lastFundResult.fullyFunded = fullyFunded
    res.json(lastFundResult)

  })
})

module.exports = api
