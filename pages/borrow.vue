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
                      :state="validation"
                      v-model="address"
                      required
                      type="text"
                      name="address" />
        <b-form-invalid-feedback :state="validation">
          Please enter a address
        </b-form-invalid-feedback>
      </b-form-group>
      
      <b-form-group label="Rate"
                    label-for="rate">
        <b-input-group>
          <b-form-input id="rate"
                        :state="validation"
                        v-model="rate"
                        required
                        type="number"
                        name="rate"/>
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
          <b-form-invalid-feedback :state="validation">
            The rate must be above 5%
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
                        :state="validation"
                        v-model="loan_amount_dollars"
                        required
                        type="number"
                        name="loan_amount_dollars"/>
          <b-form-invalid-feedback :state="validation">
            The Amount must be over $50,000.00
          </b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>

      <b-button :disabled="!validation" type="submit" variant="primary">Submit</b-button>

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
      valid: false
    }
  },
  computed: {
    validation: function() {
      return (
        this.rate > 5 &&
        this.loan_amount_dollars >= 50000 &&
        this.address != '' &&
        this.address != null
      )
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
