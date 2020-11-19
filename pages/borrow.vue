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
                      :state="addressState"
                      type="text"
                      name="address"
                      aria-describedby="address-feedback" />
        <b-form-invalid-feedback id="address-feedback">
          Address is required
        </b-form-invalid-feedback>

      </b-form-group>
      
      <b-form-group label="Rate"
                    label-for="rate">
        <b-input-group>
          <b-form-input id="rate"
                        v-model="rate"
                        :state="rateState"
                        type="number"
                        name="rate"
                        aria-describedby="rate_feedback"/>
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
          <b-form-invalid-feedback id="rate_feedback">
            Rate must be at least 5%
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
                        :state="loanAmountDollarsState"
                        type="number"
                        name="loan_amount_dollars"
                        aria-describedby="loan_amount_dollars_feedback"/>
          <b-form-invalid-feedback id="loan_amount_dollars_feedback">
            Loan amount must be at least $50,000
          </b-form-invalid-feedback>
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
      loan_amount_dollars: 100000
    }
  },
  computed: {
    addressState() {
      return this.validateField(this.address, 'required')
    },
    rateState() {
      return this.validateField(this.rate, 'aboveMinimum', { min: 5 })
    },
    loanAmountDollarsState() {
      return this.validateField(this.loan_amount_dollars, 'aboveMinimum', {
        min: 50000
      })
    }
  },
  methods: {
    validateField(field, rule, options) {
      const validations = {
        required: val => !!val.length,
        aboveMinimum: val => val > options.min
      }
      return validations[rule](field, options)
    },
    async onSubmit(ev) {
      ev.preventDefault()
      let { address, rate, expected_term_months, loan_amount_dollars } = this

      const passesValidations =
        this.validateField(address, 'required') &&
        this.validateField(rate, 'aboveMinimum', { min: 5 }) &&
        this.validateField(loan_amount_dollars, 'aboveMinimum', { min: 50000 })

      if (!passesValidations) return false

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
