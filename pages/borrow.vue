<style scoped>
@import './form.scss';
</style>
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

      <b-form-group label="Address" label-for="address">
        <b-form-input id="address" v-model="address" type="text" name="address" />
        <p v-if="errors.address" class="error">{{ errors.address }}</p>
      </b-form-group>

      <b-form-group label="Rate" label-for="rate">
        <b-input-group>
          <b-form-input id="rate" v-model="rate" type="number" name="rate" />
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
        </b-input-group>
        <p v-if="errors.rate" class="error">{{ errors.rate }}</p>
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
        <p v-if="errors.expected_term_months" class="error">{{ errors.expected_term_months }}</p>
      </b-form-group>

      <b-form-group label="LoanAmount" label-for="loan_amount_dollars">
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input
            id="loan_amount_dollars"
            v-model="loan_amount_dollars"
            type="number"
            name="loan_amount_dollars"
          />
        </b-input-group>
        <p v-if="errors.loan_amount_dollars" class="error">{{ errors.loan_amount_dollars }}</p>
      </b-form-group>

      <b-button :disabled="hasErrors" type="submit" variant="primary">Submit</b-button>
    </b-form>
  </b-container>
</template>

<script>
const requiredLabelMap = {
  address: 'Address',
  rate: 'Rate',
  expected_term_months: 'Term',
  loan_amount_dollars: 'Amount'
}
export default {
  data() {
    return {
      // errors: {},
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
    hasErrors() {
      return Object.values(this.errors).filter(error => !!error).length > 0
    },
    errors() {
      const errors = {}
      Object.entries(requiredLabelMap).forEach(([key, val]) => {
        errors[key] = !this[key] ? `${val} required` : ''
      })
      if (this.rate && this.rate <= 5) {
        errors.rate = 'Rate must be above 5%'
      }
      if (this.loan_amount_dollars && this.loan_amount_dollars <= 50000) {
        errors.loan_amount_dollars = 'Amount must be over $50,000'
      }
      return errors
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

      if (this.hasErrors) {
        return
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
