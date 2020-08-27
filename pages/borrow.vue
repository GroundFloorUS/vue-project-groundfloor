<template>
  <b-container>
    <h2 class="title">BORROW</h2>
    <p v-if="errors.length">
      <span class="form-error-msg">Please correct the following error(s):</span>
      <ul>
        <li v-for="(error, index) in errors" :key="index" class="form-error" >{{ error }}</li>
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

      <b-form-group label="LoanAmount"
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
  filters: {},
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

      const { address, rate, expected_term_months, loan_amount_dollars } = this
      const borrowData = {
        purpose: this.purpose.value,
        address,
        rate,
        expected_term_months,
        loan_amount_dollars
      }

      const isValid = this.validateForm()

      if (isValid) {
        const investment = await this.$axios({
          method: 'post',
          url: '/api/investment',
          data: borrowData
        }).catch(error => {
          console.log(error)
        })

        const initialFundingData = {
          investment_id: investment.data.id,
          amount: 0
        }

        await this.$axios({
          method: 'post',
          url: '/api/funding',
          data: initialFundingData
        }).catch(error => {
          console.log(error)
        })

        this.$router.push({ path: `/funding` })
      }
    },
    validateForm() {
      this.errors.length = 0

      if (!this.address) {
        this.errors.push('Address is empty')
      } else if (this.address.length <= 3) {
        this.errors.push('Address is too short')
      }

      if (this.rate <= 5) {
        this.errors.push('Rate needs to be more than 5%')
      }

      if (this.loan_amount_dollars <= 50000) {
        this.errors.push('Loan amount needs to be greater than $50,000')
      }

      return this.errors.length ? false : true
    }
  }
}
</script>

<style scoped>
.form-error-msg {
  font-weight: bold;
  font-size: 18px;
  color: red;
}

.form-error {
  font-size: 14px;
  color: red;
}
</style>
