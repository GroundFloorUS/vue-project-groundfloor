<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <h4>{{ investment.address }}</h4>
    <b-progress :max="100" class="mb-3" height="30px">
      <b-progress-bar :class="{'funded' : investment.fully_funded==1}" :value="percentFunded" variant="success" height="30px"/>
      <b-progress-bar :value="percentProjectedInvestment" height="30px"/>
    </b-progress>
    <div class="percent_amount">{{ percentFunded }}% Funded</div>
    <div class="inner-content">
      <b-card-text>
        <span class="label">Type: </span><span class="value">{{ investment.purpose }}</span>
      </b-card-text>
      <b-card-text>
        <span class="label">Duration:</span><span class="value">{{ investment.expected_term_months }}mo</span>
      </b-card-text>
      <b-card-text>
        <span class="label">Rate: </span><span class="value">{{ investment.rate }}%</span>
      </b-card-text>
      <b-card-text>
        <span class="label">Amount:</span><span class="value">${{ loan_amount_dollars_commas }}</span>
      </b-card-text>
    </div>
    

    <section class="investment_funds">
      <h4 class="subtitle">Loan Funds</h4>
      <div class="fundlist">
        <div v-if="funds.length">
          <div>
            <b-row v-for="fund in funds" :key="fund.id">
              <b-col>{{ fund.created_on }}</b-col>
              <b-col>${{ addCommasToAmount(fund.amount) }}</b-col>
            </b-row>
          </div>
        </div>
        <div v-else>
          <p class="empty">No funds yet for this Loan</p>
        </div>
      </div>
    </section>
    <section v-if="investment.fully_funded !=1" class="investment_form">
      <h4 class="subtitle">Invest Up to ${{ addCommasToAmount(maxFundingAllowed) }} in this Fund</h4>
      <b-form novalidate @submit="onSubmit">
        <b-form-group>
          <b-form-input id="linvestment_amount"
                        v-model="investment_amount"
                        type="number"
                        name="investment_amount"
                        step="1000"
                        @input="checkInvestmentAmount"
                        @focus="showInvestmentProgressBar"
                        @blur="hideInvestmentProgressBar"/>
          <b-button :disabled="investment_amount == 0" 
                    type="submit" 
                    name="submit" 
                    variant="primary" 
                    @mouseover="showInvestmentProgressBar" 
                    @mouseleave="hideInvestmentProgressBar">Submit</b-button>
        </b-form-group>
        <p v-if="investment_updated" class="warning">Other investments have just been made, the maximum amount to invest has lowered, click submit again to invest this amount</p>
        <h4 v-if="maxFundingAllowed==investment_amount" class="investtext">This Investment will fully fund the Loan</h4>
      </b-form>
    </section>
    
    <p>
      <b-button type="button" vairant="success" @click="goBack">
        Back
      </b-button>
    </p>

  </b-container>
</template>
<script>
export default {
  data() {
    return {
      investment_amount: 1000,
      formFocus: false,
      investment_updated: false
    }
  },
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    console.log(funds.data)
    return {
      investment: investment.data,
      funds: funds.data,
      total: 0
    }
  },
  computed: {
    //Parse the dollar amount to include comma
    loan_amount_dollars_commas: function() {
      return this.addCommasToAmount(this.investment.loan_amount_dollars)
    },
    //The max amount that can be invested
    maxFundingAllowed: function() {
      return this.investment.loan_amount_dollars - this.investment.sum
    },
    //Calcuate first percentage bar to show current funding
    percentFunded: function() {
      if (!this.investment.sum) return 0 //Can be a falsy non 0 value
      return Math.ceil(
        (this.investment.sum / this.investment.loan_amount_dollars) * 100
      )
    },
    //Calculate second percentage bar to show new investment
    percentProjectedInvestment: function() {
      if (!this.formFocus) return 0
      let sum = this.investment_amount * 1
      return Math.floor((sum / this.investment.loan_amount_dollars) * 100)
    }
  },
  methods: {
    async onSubmit(ev) {
      ev.preventDefault()
      this.investment_updated = false
      if (this.investment_amount > 0) {
        console.log('submit the form')
        console.log(this.$route)
        //Check to see if another investment has been made since the page has displayed
        let investmentCheck = await this.$axios.get(
          `/api/investment/${this.$route.params.id}`
        )
        let newFundAvailable =
          investmentCheck.data.loan_amount_dollars - investmentCheck.data.sum
        if (this.investment_amount > newFundAvailable) {
          let newFunds = await this.$axios.get(
            `/api/investment/${this.$route.params.id}/funds`
          )
          this.investment_updated = true
          this.funds = newFunds.data
          this.investment = investmentCheck.data
          this.checkInvestmentAmount()
          return false
        }
        let fund = {
          investment_id: this.investment.id,
          amount: this.investment_amount
        }
        let waitforit = await this.$axios({
          method: 'post',
          url: '/api/funding',
          data: fund
        })
        this.$router.go()
      }
    },
    checkInvestmentAmount() {
      if (this.investment_amount > this.maxFundingAllowed) {
        this.investment_amount = this.maxFundingAllowed
      }
    },
    showInvestmentProgressBar() {
      this.formFocus = true
    },
    hideInvestmentProgressBar() {
      this.formFocus = false
    },
    goBack() {
      this.$router.back()
    },
    addCommasToAmount: function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style scoped>
.inner-content * {
  color: #313e46;
}
h4 {
  color: #409dc3;
}
.subtitle {
  color: black;
  margin-top: 15px;
}
.label {
  font-weight: bold;
}
.inner-content {
  display: flex;
  flex-wrap: wrap;
}
.card-text {
  width: 50%;
  border-bottom: 3px solid #dbdbdb;
  padding-bottom: 4px;
}
.card-text span {
  width: 50%;
  display: inline-block;
}
.card-text:last-child {
  margin-bottom: 1rem;
}
.container {
  max-width: 1000px;
}
.investment_form >>> .bv-no-focus-ring {
  display: flex;
}
.btn-primary {
  background-color: #409dc3;
  border-color: #409dc3;
  width: 25%;
}
.btn-primary:hover {
  background-color: #2e718c;
}
#linvestment_amount {
  margin-right: 10px;
}
.fundlist {
  border: 1px solid #ced4da;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 30px;
}
.fundlist p {
  margin: 0;
}
.row {
  margin: 0 -5px;
  border-bottom: 1px solid #ced4da;
}
.row .col:first-child {
  max-width: 200px;
}
.row:last-child {
  border-bottom: 0;
}
.percent_amount {
  position: relative;
  top: -43px;
  font-weight: bold;
  left: 10px;
  margin-bottom: -25px;
}
.investtext {
  margin-bottom: 20px;
}
.warning {
  color: #f16f22;
}
.bg-success.funded {
  background: rgb(251, 218, 25);
  background: linear-gradient(
    180deg,
    rgba(251, 218, 25, 1) 0%,
    rgb(255 188 0) 100%
  );
}
</style>
