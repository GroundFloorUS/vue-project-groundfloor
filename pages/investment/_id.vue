<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>

    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <b-progress
        :max="investment.loan_amount_dollars"
        height="30px"
        show-progress
        class="mb-3"
      >
        <template v-for="(fund, index) in funds">
          <b-progress-bar
            v-b-tooltip.hover.html="{title: `Invested Amount: $${fund.amount} <br> Invested On: ${formatDate(fund.created_on)}`,
                                     html: true
            }"
            :key="'med-screen-' + index"
            :value="fund.amount"
            :variant="index % 2 === 0 ? 'primary' : 'info'"
            class="d-none d-md-flex"
          >
            ${{ fund.amount }}
          </b-progress-bar>
          <b-progress-bar
            :key="'small-screen-'+ index"
            :value="fund.amount"
            variant="primary"
            class="d-md-none"
          >&nbsp;
          </b-progress-bar>
        </template>
      </b-progress>
    </section>
    <div class="scroll">
      <table class="table table-striped">
        <thead>
          <tr class="text-center">
            <th scope="col">Invested Amount</th>
            <th scope="col">Invested Date</th>
          </tr>
        </thead>
        <tbody v-if="funds.length > 0">
          <template v-for="(fund, index) in funds">
            <tr
              :key="'table-row-' + index"
              class="text-center"
            >
              <td>${{ fund.amount }}</td>
              <td>{{ formatDate(fund.created_on) }}</td>
            </tr>
          </template>
        </tbody>
        <tbody v-else>
          <tr class="text-center">
            <td>--</td>
            <td>--</td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-form @submit="submitInvestment">
      <b-form-group
        label="Invest in this loan"
        label-for="invest-amount-dollars"
        label-cols-md="3"
        class="mt-3"
      >
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input
            id="invest-amount-dollars"
            v-model="investmentAmount"
            :state="investmentAmountState"
            type="number"
            name="invest-amount-dollars"
            @input="validateInvestAmt()"
          />
          <b-button
            :disabled="!investmentAmountState"
            type="submit"
            variant="primary"
            class="ml-3"
          >
            Invest
          </b-button>
          <b-form-invalid-feedback id="invest-amount-dollars-error">
            {{ investmentFeedback }}
          </b-form-invalid-feedback>
          <b-form-valid-feedback id="invest-amount-dollars-feedback">
            {{ investmentFeedback }}
          </b-form-valid-feedback>
        </b-input-group>
      </b-form-group>
    </b-form>
    <p class="mt-3">
      <b-button
        type="button"
        variant="success"
        @click="goBack"
      >
        Back
      </b-button>
    </p>

  </b-container>
</template>
<script>
export const MIN_AMT_INVEST = 10
import { formatter } from '~/static/utils'
import axios from 'axios'
export default {
  data() {
    return {
      formatter,
      MIN_AMT_INVEST,
      totalFunds: 0,
      investmentAmount: 0,
      investmentAmountState: null,
      investmentFeedback: '',
      minAmountLabel: 'Enter an amount above '
    }
  },
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data
    }
  },
  mounted() {
    this.totalFunds = this.getTotalFunds(this.funds)
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // Convert the date from YYYY-MM-DD, TODO: Move to utils
    formatDate(dateToFormat) {
      dateToFormat = dateToFormat.split(' ')[0]
      dateToFormat = dateToFormat.split('-')
      return dateToFormat[1] + '/' + dateToFormat[2] + '/' + dateToFormat[0]
    },
    async submitInvestment(ev) {
      ev.preventDefault()
      let funds = await axios({
        method: 'POST',
        url: '/api/funding',
        data: {
          investment_id: this.$route.params.id,
          amount: this.investmentAmount
        }
      })
      if (funds.data.error) {
        this.investmentFeedback = `
        ${funds.data.message} - Max amount:
        ${formatter.format(funds.data.maxAmt)}`
        this.investmentAmountState = false
      } else {
        this.investmentAmount = 0
        this.investmentAmountState = null
        let updatedFunds = await axios.get(
          `/api/investment/${this.$route.params.id}/funds`
        )
        if (updatedFunds.status === 200 && updatedFunds.data) {
          this.funds = updatedFunds.data
          this.totalFunds = this.getTotalFunds(this.funds)
        }
      }
    },
    validateInvestAmt() {
      let investmentAmount = parseFloat(this.investmentAmount || 0)
      let maxInvestment = this.investment.loan_amount_dollars - this.totalFunds
      // larger than minimum
      if (investmentAmount < MIN_AMT_INVEST) {
        this.investmentFeedback =
          this.minAmountLabel + formatter.format(MIN_AMT_INVEST)
        this.investmentAmountState = false
        // investment greater than (loan - funds) -> Not Valid - Show the max they can invest
      } else if (investmentAmount > maxInvestment) {
        this.investmentAmountState = false
        this.investmentFeedback = `${formatter.format(
          maxInvestment
        )} is the max investment you can make on this loan.`
        // investment less than (loan - funds) -> Valid show what's left on the loan
        // maybe should even snap their investment so that what is left on the loan isn't less than the minimum
      } else if (investmentAmount < maxInvestment) {
        this.investmentAmountState = true
        this.investmentFeedback = `${formatter.format(
          this.investment.loan_amount_dollars -
            (this.totalFunds + investmentAmount)
        )} left on this property!`
        // investment less than (loan - funds) -> Valid, let them know it will fully fund
      } else if (investmentAmount === maxInvestment) {
        this.investmentAmountState = true
        this.investmentFeedback = `This will fully fund this investment!`
      } else {
        this.investmentAmountState = true
      }
    },
    getTotalFunds(funds) {
      return funds.reduce((acc, currentValue) => acc + currentValue.amount, 0)
    }
  }
}
</script>
<style scoped>
.scroll {
  max-height: 250px;
  overflow-y: auto;
}
</style>
