# vue-project-groundfloor

> GROUNDFLOOR Javascript/Vue Skill Assessment

The goal behind this project is to demonstrate a working knowledge of
modern javascript, ajax requests, reactivity, and testing.

> Instructions & Getting Started
1. Fork the repo
2. Read the README.md
3. Submit a PR for your work
4. Notify us and we will take a look.

## Build Setup

You'll need node, yarn (or npm) and  [node-sqlite3](https://github.com/mapbox/node-sqlite3).

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3333
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start
```

## Vue and Nuxt Docs

[Vue Documentation](https://vuejs.org/v2/api/)

[Nuxt.js Documentation](https://nuxtjs.org).

## Basic Flow of the Application

This project is a highly abstracted version of our application, which you can see for yourself at [GROUNDFLOOR.US](https://groundfloor.us). There's no authentication or validation, no financial processes, etc., so you can simply focus on the front-end. (And maybe a little bit of SQL). Essentially GROUNDFLOOR is a market place for real-estate-backed securities. It connects people, who are looking to finance a project, with others who are looking to finance. 

Investors can choose to invest in a loan and, after the loan has been paid back, take their share of the interest rate.

The flow of the application is as follows:

1. A Borrower decides to borrow money related to a particular real estate development goal, such as house flipping. You can "apply" for a loan on the BORROW page.
2. Once you've applied to borrow money, your loan will show up in a list on the FUNDING page. You can click on it to see a single page showing your loan's information.
3. Individual investors will be able to invest in part (or all!) of your loan. Once a loan is completely funded, it will show up on the FUNDED page. If you've just set this up, there will be no loans here.
4. You can see each individual investment for a given loan and fund a loan as an investor from this page. Or, you're supposed to be able to!

After you're up and running

## Necessary Functionality and Improvements

### /borrow

* Validate address: make sure an address is entered.
* Validate rate: must be above 5%
* Validate loan amount: must be a number over $50,000.

### /funding

* Style the investment items. Change the list style, add more information, tidy it up. Use something besides a ul if you prefer.

### /investment/:id

* Add a form to invest in the loan. You just need the amount and a submit button. Check `server/api.js` for endpoints for creating funds
* Show the investments on this screen.

#### Extra Credit

* Change the `/api/fund` endpoint so that it checks if a fund has been fully funded. Reject a new investment if it's too much for that loan.
* Change the `/api/fund` endpoint so that if it fully funds a loan, it sets the db record's investment.fully_funded to 1. Then it will appear on the FUNDED screen.
* Show how much of a loan has been funded. Two places for this: the `/investment/:id` screen and the `/funding` screen.
* Change the investment form on `/investment/:id` so that it shows how much be left after purchase. You may even add a message saying something like "This will fully fund the loan."
