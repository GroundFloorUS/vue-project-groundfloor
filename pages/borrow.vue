<template>
  <b-container>
    <h2 class="title">BORROW</h2>
    <b-form @submit="onSubmit">
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

      <b-form-group
        label="Address"
        label-for="address-1"
      >
        <b-form-input
          id="address-1"
          :state="convertTrueToNull(address1State)"
          v-model="addressLine1"
          required
          placeholder="Address Line 1"
          type="text"
          name="address-1"
          @input="address1State = addressLine1.length > 0"
        />
        <b-form-invalid-feedback id="address-1-error">
          {{ reqFieldLabel }}
        </b-form-invalid-feedback>
        <!-- Optional  -->
        <b-form-input
          id="address-2"
          v-model="addressLine2"
          placeholder="Address Line 2"
          type="text"
          name="address-2"
          class="mt-3"
        />
        <b-row class="mt-3">
          <b-col md="4" cols="12">
            <b-form-input
              id="address-city"
              :state="convertTrueToNull(cityState)"
              v-model="addressCity"
              placeholder="City"
              required
              type="text"
              name="address-city"
              @input="cityState = addressCity.length > 0"
            />
            <b-form-invalid-feedback id="city-error">
              {{ reqFieldLabel }}
            </b-form-invalid-feedback>
          </b-col>
          <b-col md="4" cols="12" class="mt-3 mt-md-0">
            <b-form-select
              id="address-state"
              v-model="addressState"
              :state="convertTrueToNull(stateState)"
              :options="stateList.states"
              placeholder="State"
              name="address-state"
              @input="validateAddressState()"
            />
            <b-form-invalid-feedback id="address-state-error">
              {{ reqFieldLabel }}
            </b-form-invalid-feedback>
          </b-col>
          <b-col md="4" cols="12" class="mt-3 mt-md-0">
            <b-form-input
              id="address-zip"
              v-model="addressZip"
              :state="convertTrueToNull(zipState)"
              placeholder="Zip"
              required
              type="number"
              name="address-zip"
              @input="zipState = addressZip.length === 5"
            />
            <b-form-invalid-feedback id="zip-code-error">
              Zip code length should be 5
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-form-group>

      <b-form-group
        label="Rate"
        label-for="rate"
      >
        <b-input-group>
          <b-form-input
            id="rate"
            :state="convertTrueToNull(rateState)"
            v-model="rate"
            type="number"
            name="rate"
            @input="rateState = validateNumber(rate, MIN_RATE)"
          />
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
          <b-form-invalid-feedback id="rate-error">
            Enter a rate above {{ MIN_RATE }}%
          </b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>

      <b-form-group
        label="Expected Term"
        label-for="expected_term_months"
      >
        <b-input-group>
          <b-form-input
            id="expected_term_months"
            v-model="expected_term_months"
            type="number"
            required
            name="expected_term_months"
          />
          <b-input-group-append>
            <span class="input-group-text">months</span>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-form-group
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
            :state="convertTrueToNull(loanAmtState)"
            type="number"
            name="loan_amount_dollars"
            @input="loanAmtState = validateNumber(loan_amount_dollars, MIN_LOAN_AMT)"
          />

          <b-form-invalid-feedback id="loan_amount_dollars_error">
            Enter an amount above {{ formatter.format(MIN_LOAN_AMT) }}
          </b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
      >
        Submit
      </b-button>
    </b-form>
  </b-container>
</template>

<script>
export const MIN_RATE = 5
export const MIN_LOAN_AMT = 50000
import stateList from '~/static/us-states.json'
import { formatter } from '~/static/utils'
export default {
  data() {
    return {
      formatter,
      MIN_RATE,
      MIN_LOAN_AMT,
      stateList,
      purpose: {
        value: 'Purchase',
        options: [
          { text: 'Purchase', value: 'Purchase' },
          { text: 'Purchase & Renovation', value: 'Purchase & Renovation' },
          { text: 'Refinance - Rehab', value: 'Refinance - Rehab' },
          { text: 'Refinance - Cash Out', value: 'Refinance - Cash Out' }
        ]
      },
      rate: 10,
      expected_term_months: 12,
      loan_amount_dollars: 100000,
      addressLine1: '',
      addressLine2: '',
      addressCity: '',
      addressState: '',
      addressZip: '',
      // set these to null so it doesn't show a state, but also won't be accepted as valid
      address1State: null,
      cityState: null,
      stateState: null,
      zipState: null,
      // setting these to true since we have pre-filled defaults that are valid
      rateState: true,
      loanAmtState: true,
      // labels -- could add the rest of the hardcoded labels so we can translate, if needed
      reqFieldLabel: 'Required Field'
    }
  },
  computed: {
    // Make sure that all of the required fields are entered
    validForm() {
      return (
        this.stateState &&
        this.address1State &&
        this.cityState &&
        this.zipState &&
        this.rateState &&
        this.loanAmtState
      )
    },
    // Convert the pieces of the address into 1 line
    address() {
      let address = ''
      address = `${this.addressLine1}, ${
        this.addressLine2 ? this.addressLine2 + ', ' : ''
      } ${this.addressCity}, ${this.addressState} ${this.addressZip}`
      return address
    }
  },
  methods: {
    async onSubmit(ev) {
      ev.preventDefault()
      if (this.validForm) {
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
      } else {
        // Just double check the state validation -- only one without an event (like blur)
        // and we don't want to show an error before someone starts filling out a form
        this.validateAddressState()
      }
    },
    /**
     * Validates that a number is greater than the minimum (converts to a float)
     * @param num Number to check
     * @param min Minimum number
     * @returns returns null or false, designed to set the 'state' option on inputs, if false it will show a red error outline on input
     */
    validateNumber(num, min) {
      return parseFloat(num) > min
    },
    /**
     * Convert true to null, for state so that we don't show green, I think just red looks better
     */
    convertTrueToNull(valid) {
      return valid ? null : valid
    },
    /**
     * Validate the address-state selection, needed because there's no event fired if we click and exit
     * on the drop-down menu
     */
    validateAddressState() {
      this.stateState = this.addressState.length > 0
    }
  }
}
</script>
