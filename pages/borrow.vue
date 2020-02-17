<template>
  <b-container>
    <h2 class="title">BORROW</h2>

    <b-form @submit="onSubmit">
      <b-form-group label="Purpose"
                    label-for="purpose">
        <b-form-select id="purpose"
                       v-model="$v.form.purpose.$model"
                       :options="purpose.options"
                       name="purpose" />
      </b-form-group>

      <b-form-group label="Address"
                    label-for="address">
        <b-form-input id="address"
                      v-model="$v.form.address.$model"
                      :state="validateState('address')"
                      type="text"
                      name="address" />
        <b-form-invalid-feedback>The address is required</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Rate"
                    label-for="rate">
        <b-input-group>
          <b-form-input id="rate"
                        v-model="$v.form.rate.$model"
                        :state="validateState('rate')"
                        type="number"
                        name="rate"/>
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
          <b-form-invalid-feedback>Must be above 5%</b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>

      <b-form-group label="Expected Term"
                    label-for="expected_term_months">
        <b-input-group>
          <b-form-input id="expected_term_months"
                        v-model="$v.form.expected_term_months.$model"
                        :state="validateState('expected_term_months')"
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
                        v-model="$v.form.loan_amount_dollars.$model"
                        :state="validateState('loan_amount_dollars')"
                        type="number"
                        name="loan_amount_dollars"/>
          <b-form-invalid-feedback>Must be a number over $50,000.</b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>

    </b-form>

  </b-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minValue, numeric } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data() {
    return {
      purpose: {
        options: [
          { text: 'Purchase', value: 'Purchase' },
          { text: 'Purchase & Renovation', value: 'Purchase & Renovation' },
          { text: 'Refinance - Rehab', value: 'Refinance - Rehab' },
          { text: 'Refinance - Cash Out', value: 'Refinance - Cash Out' }
        ]
      },
      form: {
        purpose: 'Purchase',
        address: '',
        rate: 10,
        expected_term_months: 12,
        loan_amount_dollars: 100000
      }
    }
  },
  validations: {
    form: {
      address: {
        required
      },
      purpose: {
        required
      },
      loan_amount_dollars: {
        required,
        minValue: minValue(50000)
      },
      expected_term_months: {
        numeric
      },
      rate: {
        required,
        minValue: minValue(5)
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    async onSubmit(ev) {
      ev.preventDefault()
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      let {
        address,
        rate,
        expected_term_months,
        loan_amount_dollars,
        purpose
      } = this.form
      let b = {
        purpose,
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
