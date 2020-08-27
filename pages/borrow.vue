<template>
  <b-container>
    <h2 class="title">BORROW</h2>

    <validation-observer v-slot="{ handleSubmit }" ref="observer">


      <b-form @submit="onSubmit">

        <!-- purpose -->
        <b-form-group
          label="Purpose"
          label-for="purpose"
        >
          <b-form-select
            id="purpose"
            v-model="purpose.value"
            :options="purpose.options"
            name="purpose"
          />
        </b-form-group>

        <!-- address -->
        <validation-provider
          v-slot="validationContext"
          :rules="{ required: true, regex: /^\s*\S+(?:\s+\S+){2}/ }"
          name="address"
        >
          <b-form-group
            label="Address"
            label-for="address"
          >
            <b-form-input
              id="address"
              v-model="address"
              :state="getValidationState(validationContext)"
              type="text"
              name="address"
              aria-describedby="address-live-feedback"
            />
            <b-form-invalid-feedback id="address-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- rate -->
        <validation-provider
          v-slot="validationContext"
          :rules="{min_value:5}"
          name="rate"
        >
          <b-form-group
            label="Rate"
            label-for="rate"
          >
            <b-input-group>
              <b-form-input
                id="rate"
                v-model="rate"
                :state="getValidationState(validationContext)"
                type="number"
                name="rate"
                aria-describedby="rate-live-feedback"
              />
              <b-input-group-append>
                <span class="input-group-text">%</span>
              </b-input-group-append>
              <b-form-invalid-feedback id="rate-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>
        </validation-provider>

        <!-- term -->
        <b-form-group
          label="Expected Term"
          label-for="expected_term_months"
        >
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

        <!-- amount -->
        <validation-provider
          v-slot="validationContext"
          :rules="{min_value:50000}"
          name="loan amount"
        >
          <b-form-group
            label="LoanAmount"
            label-for="loan_amount_dollars"
          >
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text">$</span>
              </b-input-group-prepend>
              <b-form-input
                id="loan_amount_dollars"
                v-model="loan_amount_dollars"
                :state="getValidationState(validationContext)"
                type="number"
                name="loan_amount_dollars"
                aria-describedby="loanAmount-live-feedback"
              />
              <b-form-invalid-feedback id="loanAmount-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>
        </validation-provider>

        <b-button type="submit" variant="primary">Submit</b-button>

      </b-form>
    </validation-observer>
  </b-container>
</template>

<script>
import {
  ValidationProvider,
  ValidationObserver
} from 'vee-validate/dist/vee-validate.full'

export default {
  components: {
    'validation-observer': ValidationObserver,
    'validation-provider': ValidationProvider
  },
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
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },
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
