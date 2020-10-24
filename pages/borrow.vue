<template>
  <b-container>
    <h2 class="title">BORROW</h2>

    <b-form novalidate @submit="onSubmit">
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
                      :state="hasValidAddress"
                      type="text"
                      name="address" />

        <b-form-invalid-feedback id="address-validation">You must enter a valid address</b-form-invalid-feedback>
      </b-form-group>
      
      <b-form-group label="Rate"
                    label-for="rate">
        <b-input-group>
          <b-form-input id="rate"
                        v-model="rate"
                        :state="hasValidRate"
                        type="number"
                        name="rate"
                        step="0.01"/>
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
          
          <b-form-invalid-feedback id="rate-validation">Your rate must be more than 5%</b-form-invalid-feedback>
        </b-input-group>
        
      </b-form-group>

      <b-form-group label="Expected Term"
                    label-for="expected_term_months">
        <b-input-group>
          <b-form-input id="expected_term_months"
                        v-model="expected_term_months"
                        type="number"
                        name="expected_term_months"
                        step="1"/>
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
                        :state="hasValidAmount"
                        type="number"
                        name="loan_amount_dollars"
                        step="1"/>
          <b-form-invalid-feedback id="rate-validation">You must request a whole dollar amount more than $50,000</b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>

      <b-button :disabled="isDisabled" type="submit" variant="primary">Submit</b-button>

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
    hasValidAddress: function() {
      return this.address !== ''
    },
    hasValidRate: function() {
      return Number(this.rate) > 5
    },
    hasValidAmount: function() {
      const amount = Number(this.loan_amount_dollars)
      return amount > 50000 && Number.isInteger(amount)
    },
    isDisabled: function() {
      return !this.hasValidAddress || !this.hasValidRate || !this.hasValidAmount
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
      if (this.isDisabled) return
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
