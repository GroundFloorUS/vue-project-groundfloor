<template>
  <b-container>
    <h2 class="title">BORROW</h2>
    <p v-if="errors.length" class="alert-danger">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
    <b-form @submit="onSubmit">
      <b-form-group label="Purpose"
                    label-for="purpose">
        <b-form-select id="purpose"
                       v-model="purpose.value"
                       :options="purpose.options"
                       name="purpose" />
      </b-form-group>

      <b-form-group label="Address"
                    label-for="address">
        <b-form-input id="address"
                      v-model="address"
                      :class="addressHasError"
                      type="text"
                      name="address" />
      </b-form-group>

      <b-form-group label="Rate"
                    label-for="rate">
        <b-input-group>
          <b-form-input id="rate"
                        v-model="rate"
                        :class="rateHasError"
                        type="number"
                        name="rate"/>
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-form-group label="Expected Term"
                    label-for="expected_term_months">
        <b-input-group>
          <b-form-input id="expected_term_months"
                        v-model="expected_term_months"
                        type="number"
                        name="expected_term_months"/>
          <b-input-group-append>
            <span class="input-group-text">months</span>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-form-group label="Loan Amount"
                    label-for="loan_amount_dollars">
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input id="loan_amount_dollars"
                        v-model="loan_amount_dollars"
                        :class="loanAmountHasError"
                        type="number"
                        name="loan_amount_dollars"/>
        </b-input-group>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>

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
      loan_amount_dollars: 100000,
      errors: [],
      addressHasError: '',
      rateHasError: '',
      loanAmountHasError: ''
    }
  },
  methods: {
    clearErrors() {
      this.errors = []
      this.addressHasError = ''
      this.rateHasError = ''
      this.loanAmountHasError = ''
    },

    checkForm(address, rate, loan_amount_dollars) {
      this.clearErrors()
      const addressIsValid = this.isAddressValid(address)
      const rateIsValid = this.isRateValid(rate)
      const loanAmountIsValid = this.isLoanAmountValid(loan_amount_dollars)

      if (addressIsValid && rateIsValid && loanAmountIsValid) {
        return true
      }
      if (!addressIsValid) {
        this.errors.push('A valid email address is required.')
        this.addressHasError = 'is-invalid'
      }
      if (!rateIsValid) {
        this.errors.push('Rate must be at least 5.')
        this.rateHasError = 'is-invalid'
      }
      if (!loanAmountIsValid) {
        this.errors.push('Loan amount must be at least 50000.')
        this.loanAmountHasError = 'is-invalid'
      }
    },

    isAddressValid(address) {
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(address)
    },

    isRateValid(rate) {
      return rate >= 5
    },

    isLoanAmountValid(loanAmount) {
      return loanAmount >= 50000
    },

    async onSubmit(ev) {
      ev.preventDefault()
      let { address, rate, expected_term_months, loan_amount_dollars } = this
      const formIsValid = this.checkForm(address, rate, loan_amount_dollars)
      if (formIsValid) {
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
}
</script>
