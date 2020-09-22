<template>
  <b-container>
    <p>
      <b-button type="button" class="btn btn-sm" vairant="success" @click="goBack">Back</b-button>
    </p>
    <div v-if="investment.fully_funded === 1 || investment.fully_funded" class="funded">
      <h3>FUNDED</h3>
    </div>
    <h1 class="title">LOAN&#160;#{{ investment_id }}</h1>
    <div class="group">
      <section class="investment_table">
        <h4>INFORMATION</h4>
        <table class="table loan-info">
          <tbody>
            <tr>
              <td>Purpose</td>
              <td>{{ investment.purpose }}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{{ investment.address }}</td>
            </tr>
            <tr>
              <td>Rate</td>
              <td>{{ investment.rate }}</td>
            </tr>
            <tr>
              <td>Expected Term</td>
              <td>{{ investment.expected_term_months }}</td>
            </tr>
            <tr>
              <td>Loan Amount</td>
              <td>{{ investment.loan_amount_dollars | asCurrency }}</td>
            </tr>
            <tr>
              <td>Amount Funded</td>
              <td>{{ sumFunds || 0 | asCurrency }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="investment_funds">
        <div>
          <div
            v-if="investment.fully_funded !== 1 || !investment.fully_funded"
            class="add-funding-form"
          >
            <h4>ADD FUND</h4>
            <b-form class="form-inline" @submit.prevent="onSubmit">
              <b-form-group :class="{ 'text-danger': $v.amount.$error }" label-for="amount">
                <b-input-group>
                  <b-input-group-prepend>
                    <span class="input-group-text">$</span>
                  </b-input-group-prepend>
                  <b-form-input
                    id="amount"
                    v-model.trim="$v.amount.$model"
                    type="text"
                    name="amount"
                    placeholder="Amount"
                  />
                </b-input-group>
              </b-form-group>
              <h3>&#160;</h3>
              <b-input-group>
                <b-button class="submit-btn" type="submit" variant="primary">Submit</b-button>
              </b-input-group>
              <h3>&#160;</h3>
            </b-form>
            <small
              v-if="$v.amount.$error"
              :class="{ 'text-danger': $v.amount.$error }"
            >Minimum Fund Amount is $5,000</small>
          </div>
          <div>
            <h4>FUNDS</h4>
          </div>
        </div>
        <table v-if="funds.length > 0" class="table table-striped">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fund in funds" :key="fund.id">
              <td>{{ fund.amount | asCurrency }}</td>
              <td>{{ fund.created_on }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <strong>No Funds Available</strong>
        </div>
      </section>
    </div>
  </b-container>
</template>
<script>
import { asCurrency } from '../../common/filters'
import { validateFundingAmount } from '../../common/validations'

export default {
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data,
      amount: 10000,
      investment_id: params.id
    }
  },
  validations: {
    amount: {
      validateFundingAmount
    }
  },
  filters: {
    asCurrency
  },
  computed: {
    sumFunds() {
      return this.funds.reduce((acc, item) => {
        return acc + item.amount
      }, 0)
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async onSubmit(ev) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let { amount } = this
        let data = {
          amount,
          investment_id: this.investment_id
        }
        let fund = await this.$axios({
          method: 'post',
          url: '/api/funding',
          data
        })
        console.log(fund)
        const retData = fund.data
        if (retData && retData.error) {
          // SHOW ERROR IN UI INSTEAD OF CONSOLE LOG?
          console.log(retData.error)
          return
        }
        this.funds.push(fund.data)
        if (fund.data.fullyFunded) {
          this.investment.fully_funded = fund.data.fullyFunded
        }
      }
    }
  }
}
</script>

<style>
h4 {
  color: #333b3f;
}
.group {
  display: flex;
}
.group section {
  padding: 10px;
}
.loan-info {
  max-width: 300px !important;
  background: #f9f9f9;
}
.loan-info tr td:first-child {
  font-weight: bold;
}
.investment_funds > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.add-funding-form {
  /* margin-bottom: 20px; */
  min-height: 120px;
}
.funded {
  color: #004c00;
  background: #00d400;
  border: 1px solid #003e00;
  padding: 5px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 10px;
}
</style>
