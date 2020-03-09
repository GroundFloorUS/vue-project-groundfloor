<template>
  <b-container>
    <h2 class="title">BORROW</h2>
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
                      :class="{ 'is-invalid': errors.required_address }"
                      type="text"
                      name="address" />
        <b-form-invalid-feedback v-if="errors.required_address">
          Address is required.
        </b-form-invalid-feedback>
      </b-form-group>
      
      <b-form-group label="Rate"
                    label-for="rate">
        <b-input-group>
          <b-form-input id="rate"
                        v-model="rate"
                        :class="{ 'is-invalid': errors.min_loan_rate }"
                        type="number"
                        name="rate"/>
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
          <b-form-invalid-feedback v-if="errors.min_loan_rate">
            Loan rate must be above 5%
          </b-form-invalid-feedback>
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

      <b-form-group label="LoanAmount"
                    label-for="loan_amount_dollars">
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input id="loan_amount_dollars"
                        v-model="loan_amount_dollars"
                        :class="{ 'is-invalid': errors.min_loan_amount }"
                        type="number"
                        name="loan_amount_dollars"/>
          <b-form-invalid-feedback v-if="errors.min_loan_amount">
            Loan must be at least $50,000.
          </b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>

    </b-form>
      
  </b-container>
</template>

<script>
const MIN_LOAN_AMOUNT = 50000
const MIN_LOAN_RATE = 5
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
      errors: []
    }
  },
  methods: {
    async onSubmit(ev) {
      ev.preventDefault()
      this.validate()
      if (!Object.keys(this.errors).length) {
        ev.preventDefault()
        let { address, rate, expected_term_months, loan_amount_dollars } = this
        let data = {
          purpose: this.purpose.value,
          address,
          rate,
          expected_term_months,
          loan_amount_dollars
        }
        let investment = await this.$axios({
          method: 'post',
          url: '/api/investment',
          data
        })
        this.$router.push({ path: `/funding` })
      }
    },
    validate() {
      this.errors = {}
      if (!this.address) {
        this.errors.required_address = true
      }
      if (this.loan_amount_dollars < MIN_LOAN_AMOUNT) {
        this.errors.min_loan_amount = true
      }
      if (this.rate < MIN_LOAN_RATE) {
        this.errors.min_loan_rate = true
      }
    }
  }
}
</script>
