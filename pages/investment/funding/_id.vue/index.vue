<template>
  <b-container>
    <h1 class="title">INVEST</h1>
    <section class="investment_funds">
      <h3 class="subtitle">Invest Funds
        <span v-if="isFullyFunded" class="fully-funded-msg"> - Closed, funding complete.</span>
      </h3>
      <ul>
        <!-- TODO: list all funds -->
      </ul>
      <div>
        You have chosen to fund the property located at:
        <span class="highlighted-property">{{ investment.address }}</span>
      </div>
      <div>
        Amount left until fully funded:
        <span class="highlighted-property">{{ fundsLeft | currency }}</span>
      </div>
      <div>
        Full investementamount:
        <span class="highlighted-property">{{ investment.loan_amount_dollars | currency }}</span>
      </div>
      <br />
      <br />
      <div v-if="!isFullyFunded" class="funding-form" >
        <b-form @submit="onSubmit">
          <b-form-group label="Funding Amount" label-for="funding-amount">
            <b-form-input
              id="funding-amount"
              v-model="fundingAmount"
              type="number"
              name="funding-amount"
              placeholder="Enter funding amount"
            />
            <div v-if="errors.length">
              <div class="form-error-msg">Please correct the following error:</div>
              <ul>
                <li v-for="(error, index) in errors" :key="index" class="error-msg">{{ error }}</li>
              </ul>
            </div>
            <div v-if="submitSuccess">
              <div class="form-msg">Your Funds have been submitted.</div>
            </div>
            <b-button type="submit" variant="primary" class="btn-submit">Submit</b-button>
          </b-form-group>
        </b-form>
      </div>
    </section>
    <br />
    <b-button type="button" vairant="success" @click="goBack">Back</b-button>
  </b-container>
</template>
<script>
import { currencyFilter } from '../../../../shared/number-filters'

export default {
  filters: {
    currency: currencyFilter
  },
  data() {
    return {
      errors: [],
      fundingAmount: null,
      submitSuccess: false
    }
  },
  async asyncData({ $axios, params }) {
    let investment = await $axios
      .get(`/api/investment/${params.id}`)
      .catch(error => {
        console.log(error)
      })

    let fund = await $axios.get(`/api/fund/${params.id}`).catch(error => {
      console.log(error)
    })

    return {
      investment: investment.data,
      fund: fund.data
    }
  },
  computed: {
    fundsLeft() {
      return this.fund.amount_til_funded
    },
    isFullyFunded() {
      return this.fund.amount_til_funded === 0 ? true : false
    }
  },
  methods: {
    async onSubmit(ev) {
      ev.preventDefault()

      if (this.isValid(this.fundingAmount)) {
        console.log('saving loan amount')
        let fundingInfo = await this.$axios({
          method: 'post',
          url: '/api/funding',
          data: {
            investment_id: this.investment.id,
            amount: this.fundingAmount
          }
        }).catch(error => {
          console.log(error)
        })

        this.submitSuccess = true

        let fund = await this.$axios
          .get(`/api/fund/${this.investment.id}`)
          .catch(error => {
            console.log(error)
          })

        this.fund.amount_til_funded = fund.data.amount_til_funded

        if (this.fund.amount_til_funded === 0) {
          const putData = {
            id: Number(this.investment.id)
          }

          await this.$axios({
            method: 'put',
            url: '/api/fund',
            data: putData
          }).catch(error => {
            console.log(error)
          })
        }
      }
    },
    isValid(amount) {
      this.errors.length = 0
      amount = Number(amount)

      if (typeof amount !== 'number') {
        this.errors.push('Amount must be a number')
      }

      if (amount < 0) {
        this.errors.push('Amount must be non-negative')
      }

      if (amount > this.fund.amount_til_funded) {
        this.errors.push(
          `Funding amount can not be more than fund amount left, e.g., $${
            this.fund.amount_til_funded
          }`
        )
      }

      return this.errors.length ? false : true
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.highlighted-property {
  font-weight: 700;
}
.funding-form {
  width: 600px;
}
.btn-submit {
  margin-top: 30px;
}
.form-error-msg {
  color: red;
  font-weight: 700;
}
.error-msg {
  color: red;
  font-size: 0.8rem;
}
.form-msg {
  color: inherited;
  font-weight: 700;
}
.fully-funded-msg {
  color: green;
  font: inherit;
}
</style>
