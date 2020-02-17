<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>


    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <b-card v-if="maxAmount > 0">
        <b-form @submit="onSubmit">
          <b-form-group label="Invest Amount"
                        label-for="invest_amount_dollars">
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text">$</span>
              </b-input-group-prepend>
              <b-form-input id="invest_amount_dollars"
                            v-model="$v.form.amount.$model"
                            :state="validateState('amount')"
                            type="number"
                            name="invest_amount_dollars"/>
              <b-form-invalid-feedback>Must be between (1, {{ maxAmount }}).</b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-card>
      <b-card v-else bg-variant="success" title="This will fully fund the loan."/>
      <div class="totals">
        <b-progress :max="investment.loan_amount_dollars * 1" show-progress animated height="2rem">
          <b-progress-bar :value="totalFunds">
            <strong>${{ totalFunds }} / ${{ investment.loan_amount_dollars }}</strong>
          </b-progress-bar>
          <b-progress-bar v-if="maxAmount > 0" :value="form.amount * 1" :variant="potencialFundsVariant">${{ form.amount }}</b-progress-bar>
        </b-progress>
      </div>
      <ul class="funds-list">
        <!-- TODO: list all funds -->
        <template v-if="funds.length > 0">
          <li v-for="fund in funds" :key="fund.id">
            <p><b>Date:</b> {{ fund.created_on }}
            <b>Amount:</b> ${{ fund.amount }}</p>
          </li>
        </template>
        <li v-else>
          No Funds
        </li>
      </ul>
    </section>
    <b-row>
      <b-button type="button" vairant="success" @click="goBack">
        Back
      </b-button>
    </b-row>

  </b-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { between, required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data,
      form: {
        amount: 1
      }
    }
  },
  computed: {
    potencialFunds: {
      get() {
        return this.totalFunds * 1 + this.form.amount * 1
      }
    },
    potencialFundsVariant: {
      get() {
        const delta = this.potencialFunds - this.investment.loan_amount_dollars
        return delta < 0 ? 'warning' : delta > 0 ? 'danger' : 'success'
      }
    },

    totalFunds: {
      get() {
        return this.funds.reduce((a, c) => a + c.amount * 1, 0)
      }
    },
    maxAmount: {
      get() {
        return this.investment.loan_amount_dollars * 1 - this.totalFunds * 1
      }
    }
  },
  validations() {
    return {
      form: {
        amount: {
          required,
          between: between(1, this.maxAmount)
        }
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    goBack() {
      this.$router.back()
    },
    async onSubmit(ev) {
      ev.preventDefault()
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      let funding = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: { amount: this.form.amount, investment_id: this.investment.id }
      })
      let funds = await this.$axios.get(
        `/api/investment/${this.investment.id}/funds`
      )
      this.funds = funds.data
      this.form.amount = 1
    }
  }
}
</script>

<style lang="scss">
ul.funds-list {
  margin-top: 20px;
  list-style: none;
}
.totals {
  padding-top: 20px;
}
.progress {
  background-color: #35495e;
}
.progress-bar {
  min-width: min-content;
}
</style>
