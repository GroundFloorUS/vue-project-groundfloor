<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <div>
      <b-button type="button" vairant="success" @click="goBack">
        Back
      </b-button>
    </div>
    <load-card :investment="investment" :show-progress="!investment.fully_funded" />

    <div class="flex">
      <section class="investment_funds">
        <h3 class="subtitle">Loan Funds</h3>
        <div v-if="!funds.length" class="empty-state">This investment hasn't been funded yet. You could be the first!</div>
        <b-list-group v-if="funds.length" style="margin-bottom: 1rem">
          <b-list-group-item v-for="fund in funds" :key="fund.id" class="item">${{ fund.amount | commafy }} on {{ fund.created_on | simpleDate }}</b-list-group-item>
        </b-list-group>
      </section>
      <hr >
      <section v-if="!investment.fully_funded">
        <h3 class="subtitle">Your Contribution</h3>
        <b-form @submit="onSubmit">
          
          <b-form-group label="Amount to Fund" label-for="amount">
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text">$</span>
              </b-input-group-prepend>
              <b-form-input id="amount"
                            v-model="amount"
                            type="number"
                            name="amount"
                            min="1"
                            step="1"
                            autocomplete="off"
              />
            </b-input-group>
          </b-form-group>

          <b-alert
            :show="isTooMuch"
            variant="danger"
            data-testref="tooMuchAlert"
          >
            The amount you are offering to invest is more than the amount available to fund. Please reduce your fund amount. The maximum you can fund is <strong>${{ remainingAmount | commafy }}</strong>.
          </b-alert>
          <b-alert :show="isExactAmount" variant="success" data-testref="isExactAlert">Your investment will fully fund this loan!</b-alert>

          <div>Amount remaining to invest: <strong data-testref="remainingAmount">${{ remainingAmount | commafy }}</strong></div>
          <div v-show="!isDisabled">Amount remaining after your investment: <strong data-testref="remainingAfterInvestment">${{ remainingAmount - amount | commafy }}</strong></div>

          <hr >
          <div class="expectation">
            <div>
              <span class="expectation__title">Inital Investment: </span>
              <span data-testref="initial">${{ Number(amount) | commafy }}</span>
            </div>
            <div>
              <span class="expectation__title">Interest: </span>
              <span data-testref="interest">${{ expectedInterest | commafy }}</span>
            </div>
            <div>
              <span class="expectation__title">Expected Return: </span>
              <span class="expectation__total" data-testref="return">${{ expectedReturn | commafy }}</span>
            </div>
          </div>
          <hr >

          <div class="button-container">
            <b-button :disabled="isDisabled" type="submit" variant="primary">Submit</b-button>
          </div>
        
        </b-form>
      </section>
    </div>

  </b-container>
</template>
<script>
import LoadCard from '~/components/LoanCard.vue'

function calculatedReturn(amount, rate, term) {
  return Math.floor(Number(amount) * (Number(rate) / 100) * (Number(term) / 12))
}

export default {
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data
    }
  },
  components: { LoadCard },
  data: function() {
    return {
      amount: 10
    }
  },
  computed: {
    isDisabled: function() {
      return Number(this.amount) < 1 || this.isTooMuch
    },
    isTooMuch: function() {
      return Number(this.amount) > this.remainingAmount
    },
    isExactAmount: function() {
      return Number(this.amount) === this.remainingAmount
    },
    expectedInterest: function() {
      const value = calculatedReturn(
        this.investment.loan_amount_dollars,
        this.investment.rate,
        this.investment.expected_term_months
      )
      return Math.round(
        (value * Number(this.amount)) / this.investment.loan_amount_dollars
      )
    },
    expectedReturn: function() {
      return this.expectedInterest + Number(this.amount)
    },
    remainingAmount: function() {
      return (
        this.investment.loan_amount_dollars - Number(this.investment.funded | 0)
      )
    }
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault()
      if (this.isDisabled) return
      try {
        await this.$axios({
          method: 'post',
          url: '/api/funding',
          data: { amount: this.amount, investment_id: this.$route.params.id }
        })
        this.$router.push({ path: `/funding` })
      } catch (e) {
        if (e.message === 'Request failed with status code 412') {
          // NOTE: You shouldn't be able to get here because validation is handled client side.
          // It is set up in the api to return an error code of 412 but there is no additional
          // UI updates because the input would already be invalidated and submitting prevented.
          console.log('this was a too much money error. update the ui')
        }
      }
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style scoped>
.flex {
  display: flex;
  margin: 0 -1rem;
}
section {
  margin: 0;
  padding: 1rem;
  flex: 1 0 50%;
}
@media screen and (max-width: 768px) {
  .flex {
    display: block;
    margin: 1rem 0;
  }
  section {
    padding: 0;
  }
}
hr {
  margin: 1rem 0;
  padding: 0;
  height: 1px;
  background: #40a6cc;
  border: none;
}
.empty-state {
  margin: 1rem 0;
  padding: 3rem;
  text-align: center;
  background: whitesmoke;
  border: 1px solid lightgray;
  border-radius: 3px;
}
.expectation__title {
  display: inline-block;
  min-width: 140px;
}
.expectation__total {
  color: #41b883;
  font-size: 18px;
  font-weight: 600;
}
.button-container {
  display: flex;
}
.button-container button {
  margin-left: auto;
}
</style>
