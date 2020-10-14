<template>
  <b-container>
    <b-button style="margin-bottom: 1rem" type="button" vairant="success" @click="goBack">
      Back
    </b-button>

    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>
    <p>Loan Amount: {{ investment.loan_amount_dollars }}</p>
    <p>Funded Amount: {{ sumFunds }}</p>

    <div>
      <p v-if="investment.loan_amount_dollars - sumFunds <= 0" class="font-weight-bold text-success text-center">
        <img :src="imgUrl" style="height: 25px">
        Loan is fully funded!
        <img :src="imgUrl" style="height: 25px">
      </p>

      <b-form v-else class="mb-4 border rounded p-4" style="max-width: 300px;" @submit.stop.prevent="onSubmit">
        <b-form-group label="Amount"
                      label-for="amount">
          <b-form-input id="amount"
                        v-model="$v.amount.$model"
                        :state="validateState('amount')"
                        type="number"
                        name="amount"
                        min="1" />
          <b-form-invalid-feedback>This is a required field and must be between $1 and {{ investment.loan_amount_dollars - amount - sumFunds }}</b-form-invalid-feedback>
        </b-form-group>

        <p>Amount Left: {{ investment.loan_amount_dollars - $v.amount.$model - sumFunds }}</p>
        <b-button :disabled="isFullyFunded()" type="submit" variant="primary">Submit</b-button>
      </b-form>
    </div>

    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <b-table ref="funds" :items="funds" :fields="fields" striped hover />
    </section>
  </b-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data() {
    return {
      amount: 1,
      imgUrl:
        'https://media1.tenor.com/images/55f1920d35a7d5599054b2b2c51d8945/tenor.gif?itemid=6055878'
    }
  },
  async asyncData({ $axios, params }) {
    const investment = await $axios.get(`/api/investment/${params.id}`)
    const funds = await $axios.get(`/api/investment/${params.id}/funds`)
    const sumFunds = funds.data.reduce(
      (accumulator, fund) => accumulator + fund.amount,
      0
    )
    return {
      fields: [
        {
          key: 'id'
        },
        {
          key: 'amount',
          sortable: true
        },
        {
          key: 'created_on',
          sortable: true
        }
      ],
      investment: investment.data,
      funds: funds.data,
      sumFunds
    }
  },
  validations: {
    amount: {
      required,
      minValue: minValue(1)
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    isFullyFunded() {
      return (
        this.fully_funded ||
        parseInt(this.amount) + parseInt(this.sumFunds) >
          this.investment.loan_amount_dollars
      )
    },
    async onSubmit() {
      this.$v.$touch()
      if (this.$v.$anyError) return
      const b = {
        investment_id: this.$route.params.id,
        amount: this.amount
      }
      const investment = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: b
      })
      const funds = await this.$axios.get(
        `/api/investment/${this.$route.params.id}/funds`
      )
      this.funds = funds.data
      this.sumFunds = funds.data.reduce(
        (accumulator, fund) => accumulator + fund.amount,
        0
      )
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name]
      return $dirty ? !$error : null
    }
  }
}
</script>
