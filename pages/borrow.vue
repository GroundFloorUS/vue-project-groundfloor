<template>
  <b-container>
    <h2 class="title">BORROW</h2>
    <b-alert :show="errors.length > 0" variant="danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </b-alert>

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
                      type="text"
                      name="address" />
      </b-form-group>
      
      <b-form-group label="Rate"
                    label-for="rate">
        <b-input-group>
          <b-form-input id="rate"
                        v-model="rate"
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
      errors: []
    }
  },
  methods: {
    async onSubmit(ev) {
      ev.preventDefault()
      let errors = []
      let { address, rate, expected_term_months, loan_amount_dollars } = this
      // validate address, rate, loan amount
      address = (address || '').trim()
      rate = parseFloat(rate)
      loan_amount_dollars = parseFloat(loan_amount_dollars)
      if (address == '') {
        errors.push('Invalid Address')
      }
      if (rate < 5) {
        errors.push('Rate must be greater than 5%')
      }
      if (loan_amount_dollars < 50000) {
        errors.push('Loan amount must be greater than $50,000')
      }
      let b = {
        purpose: this.purpose.value,
        address,
        rate,
        expected_term_months,
        loan_amount_dollars
      }
      if (errors.length > 0) {
        this.errors = errors
      } else {
        this.errrors = []
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
