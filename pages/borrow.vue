<template>
  <b-container>
    <h2 class="title">BORROW</h2>

    <b-form @submit.prevent="onSubmit">
      <b-form-group label="Purpose" label-for="purpose">
        <b-form-select
          id="purpose"
          v-model="purpose.value"
          :options="purpose.options"
          name="purpose"
        />
      </b-form-group>

      <b-form-group
        :class="{ 'text-danger': $v.address.$error }"
        label-for="address"
        label="Address"
      >
        <b-form-input id="address" v-model.trim="$v.address.$model" type="text" name="address" />
        <small v-if="$v.address.$error">Address is not the correct format.</small>
      </b-form-group>

      <b-form-group :class="{ 'text-danger': $v.rate.$error }" label="Rate" label-for="rate">
        <b-input-group>
          <b-form-input id="rate" v-model="rate" type="number" name="rate" />
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
        </b-input-group>
        <small v-if="$v.rate.$error">Rate of 5% or greater is required.</small>
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
      </b-form-group>

      <b-form-group
        :class="{ 'text-danger': $v.loan_amount_dollars.$error }"
        label="Loan Amount"
        label-for="loan_amount_dollars"
      >
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
        <small v-if="$v.loan_amount_dollars.$error">Loan Amount of $10,000 or greater is required.</small>
      </b-form-group>

      <b-button class="btn btn-block" type="submit" variant="primary">Submit</b-button>
    </b-form>
  </b-container>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import {
  validateAddress,
  validateRate,
  validateLoanAmount
} from '../common/validations'

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
  validations: {
    address: {
      validateAddress
    },
    rate: {
      validateRate
    },
    loan_amount_dollars: {
      validateLoanAmount
    }
  },
  methods: {
    async onSubmit(ev) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
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
}
</script>
