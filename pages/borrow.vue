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
                      type="text"
                      name="address" />
        <p v-if="userInput.address.isInvalid">
          <span class="error-text">{{ userInput.address.message }}</span> 
        </p>
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
        <p v-if="userInput.rate.isInvalid">
          <span class="error-text">{{ userInput.rate.message }}</span> 
        </p>
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
        <p v-if="userInput.loan_amount_dollars.isInvalid">
          <span class="error-text">{{ userInput.loan_amount_dollars.message }}</span> 
        </p>
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
      userInput: {
        address: {
          isInvalid: false,
          message: 'Please enter an address'
        },
        rate: {
          isGood: false,
          message: 'Please enter a rate greater than 5%'
        },
        loan_amount_dollars: {
          isGood: false,
          message: 'To best serve you, we require an amount greater than $50000'
        }
      }
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

      let errorCount = 0

      if (this.address.length <= 6) {
        this.userInput.address.isInvalid = true
        errorCount++
      } else {
        this.userInput.address.isInvalid = false
      }
      if (this.rate <= 5) {
        this.userInput.rate.isInvalid = true
        errorCount++
      } else {
        this.userInput.rate.isInvalid = false
      }
      if (this.loan_amount_dollars <= 50000) {
        this.userInput.loan_amount_dollars.isInvalid = true
        errorCount++
      } else {
        this.userInput.loan_amount_dollars.isInvalid = false
      }

      if (errorCount > 0) {
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
