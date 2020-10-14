<template>
  <b-container>
    <h2 class="title">BORROW</h2>

    <b-form ref="form" @submit.stop.prevent="onSubmit">
      <b-form-group label="Purpose"
                    label-for="purpose">
        <b-form-select id="purpose"
                       v-model="form.purpose.value"
                       :options="form.purpose.options"
                       name="purpose" />
      </b-form-group>

      <b-form-group label="Address"
                    label-for="address">
        <b-form-input id="address"
                      v-model="$v.form.address.$model"
                      :state="validateState('address')"
                      type="text"
                      name="address" />
        <b-form-invalid-feedback>This is a required field and must be a valid address</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Rate"
                    label-for="rate"
                    invalid-feedback="Rate is required and must be greater than 5%">
        <b-input-group>
          <b-form-input id="rate"
                        v-model="$v.form.rate.$model"
                        :state="validateState('rate')"
                        name="rate"
                        type="number"
                        min="5" />
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
          <b-form-invalid-feedback>This is a required field and must be greater than 5</b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>

      <b-form-group label="Expected Term"
                    label-for="expected_term_months">
        <b-input-group>
          <b-form-input id="expected_term_months"
                        v-model="$v.form.expected_term_months.$model"
                        :state="validateState('expected_term_months')"
                        type="number"
                        name="expected_term_months"
                        min="0"/>
          <b-input-group-append>
            <span class="input-group-text">months</span>
          </b-input-group-append>
          <b-form-invalid-feedback>This is a required field and must be greater than 0</b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>

      <b-form-group label="Loan Amount"
                    label-for="loan_amount_dollars">
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input id="loan_amount_dollars"
                        v-model="$v.form.loan_amount_dollars.$model"
                        :state="validateState('loan_amount_dollars')"
                        type="number"
                        name="loan_amount_dollars"
                        step="5000"
                        min="50000" />
          <b-form-invalid-feedback>This is a required field and must be greater than 50,000</b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button class="ml-2" @click="resetForm()">Reset</b-button>
    </b-form>

  </b-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minValue } from 'vuelidate/lib/validators'

const formInit = {
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

const validAddressChars = value => {
  const regex = /[^[a-zA-Z0-9\s,'-]*$]/gi
  if (regex.test(value)) {
    return false
  }
  return true
}

export default {
  mixins: [validationMixin],
  data() {
    return { form: { ...formInit } }
  },
  validations: {
    form: {
      address: {
        required,
        validAddressChars
      },
      rate: {
        required,
        minValue: minValue(5)
      },
      expected_term_months: {
        required,
        minValue: minValue(0)
      },
      loan_amount_dollars: {
        required,
        minValue: minValue(50000)
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    resetForm() {
      this.form = { ...formInit }

      this.$nextTick(() => {
        this.$v.form.$reset()
      })
    },
    async onSubmit(ev) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      const b = {
        ...this.form,
        purpose: this.form.purpose.value
      }
      const investment = await this.$axios({
        method: 'post',
        url: '/api/investment',
        data: b
      })
      this.$router.push({ path: `/funding` })
    }
  }
}
</script>
