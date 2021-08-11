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
                      :class="{'input-invalid': errors.address.inValid}"
                      type="text"
                      name="address" />
        <span
          v-show="errors.address.inValid"
          class="error-msg"
          v-text="errors.address.message"
        />
      </b-form-group>
      
      <b-form-group label="Rate"
                    label-for="rate">
        <b-input-group>
          <b-form-input id="rate"
                        v-model="rate"
                        :class="{'input-invalid': errors.rate.inValid}"
                        type="number"
                        name="rate"/>
          <b-input-group-append>
            <span :class="{'input-invalid': errors.rate.inValid}" class="input-group-text">%</span>
          </b-input-group-append>
        </b-input-group>
        <span
          v-show="errors.rate.inValid"
          class="error-msg"
          v-text="errors.rate.message"
        />
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
            <span :class="{'input-invalid': errors.rate.inValid}" class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input id="loan_amount_dollars"
                        v-model="loan_amount_dollars"
                        :class="{'input-invalid': errors.loan.inValid}"
                        type="number"
                        name="loan_amount_dollars"/>
        </b-input-group>
        <span
          v-show="errors.loan.inValid"
          class="error-msg"
          v-text="errors.loan.message"
        />
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
      errors: {
        address: {
          inValid: false,
          message: 'Address is required'
        },
        rate: {
          inValid: false,
          message: 'Rate must be above 5%'
        },
        loan: {
          inValid: false,
          message: 'Loan must be more than $50,000'
        }
      }
    }
  },
  methods: {
    async onSubmit(ev) {
      ev.preventDefault()
      this.validateForm()
      return
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
    },
    validateForm() {
      this.errors.address.inValid = this.address === ''
      this.errors.rate.inValid = this.rate <= 5
      this.errors.loan.inValid = this.loan_amount_dollars <= 50000
    }
  }
}
</script>
<style scoped>
.input-invalid {
  border-color: red;
}
.error-msg {
  font-size: 0.75em;
  color: red;
}
</style>
