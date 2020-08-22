<template>
  <b-container>
    <h2 class="title">BORROW</h2>

    <b-form @submit="onSubmit">
      <b-form-group label="Purpose" label-for="purpose">
        <b-form-select
          id="purpose"
          v-model="purpose.value"
          :options="purpose.options"
          name="purpose"
        />
      </b-form-group>

      <b-form-group
        :state="addressValidity"
        :invalid-feedback="invalidAddressFeedback"
        label="Address"
        label-for="address"
      >
        <b-form-input
          id="address"
          :state="addressValidity"
          v-model="address"
          data-cy="address-input"
          type="text"
          name="address"
        />
      </b-form-group>

      <b-form-group
        :state="rateValidity"
        :invalid-feedback="invalidRateFeedback"
        label="Rate"
        label-for="rate"
      >
        <b-input-group>
          <b-form-input
            id="rate"
            :state="rateValidity"
            v-model="rate"
            data-cy="rate-input"
            type="number"
            name="rate"
          />
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-form-group label="Expected Term" label-for="expected_term_months">
        <b-input-group>
          <b-form-input
            id="expected_term_months"
            v-model="expected_term_months"
            type="number"
            name="expected_term_months"
          />
          <b-input-group-append>
            <span class="input-group-text">months</span>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-form-group
        :invalid-feedback="invalidLoanAmountFeedback"
        :state="loanAmountValidity"
        label="LoanAmount"
        label-for="loan_amount_dollars"
      >
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input
            id="loan_amount_dollars"
            :state="loanAmountValidity"
            v-model="loan_amount_dollars"
            data-cy="loan-amount-input"
            type="number"
            name="loan_amount_dollars"
          />
        </b-input-group>
      </b-form-group>

      <b-button
        :disabled="formDisabled"
        class="submit-button"
        data-cy="submit-button"
        type="submit"
        variant="primary"
      >Submit</b-button>
    </b-form>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      purpose: {
        value: 'Purchase',
        options: [
          { text: 'Purchase', value: 'Purchase' },
          { text: 'Purchase & Renovation', value: 'Purchase & Renovation' },
          { text: 'Refinance - Rehab', value: 'Refinance - Rehab' },
          { text: 'Refinance - Cash Out', value: 'Refinance - Cash Out' }
        ]
      },
      address: '',
      rate: 10,
      expected_term_months: 12,
      loan_amount_dollars: 100000
    }
  },
  computed: {
    addressValidity() {
      return this.address.length >= 1
    },
    rateValidity() {
      return this.rate > 5
    },
    loanAmountValidity() {
      return this.loan_amount_dollars > 50000
    },
    invalidAddressFeedback() {
      return this.address.length === 0 ? 'Invalid Address' : ''
    },
    invalidRateFeedback() {
      return this.rate <= 5 ? 'You must set a rate greater than 5' : ''
    },
    formDisabled() {
      return (
        this.address.length < 1 ||
        this.rate <= 5 ||
        this.loan_amount_dollars < 50000
      )
    },
    invalidLoanAmountFeedback() {
      return this.loan_amount_dollars < 50000
        ? 'We currently only allow loan amounts above $50,000'
        : ''
    }
  },
  methods: {
    async onSubmit(ev) {
      ev.preventDefault()
      let { address, rate, expected_term_months, loan_amount_dollars } = this
      let b = {
        purpose: this.purpose.value,
        address,
        rate,
        expected_term_months,
        loan_amount_dollars
      }
      let investment = await this.$axios({
        method: 'post',
        url: '/api/investment',
        data: b
      })
      this.$router.push({ path: `/funding` })
    }
  }
}
</script>

<style>
.submit-button:disabled {
  background: grey;
  border: none;
}
</style>
