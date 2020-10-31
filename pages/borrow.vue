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

      <b-form-group :class="{'invalid':ui.addressMessage}" label="Address"
                    label-for="address">
        <b-form-input id="address"
                      v-model="address"
                      type="text"
                      name="address" @blur="checkAddress" @input="checkAddress"/>
        <div class="invalidmessage">Please enter an Address</div>
      </b-form-group>
      
      <b-form-group :class="{ 'rate invalid': ui.ratemessage, 'rate': !ui.ratemessage }"
                    label="Rate"
                    label-for="rate">
        <b-input-group>
          <b-form-input id="rate"
                        v-model="rate"
                        type="number"
                        name="rate" @change="checkRate"/>
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
        </b-input-group>
        <transition name="fade">
          <div v-if="ui.ratemessage" class="message">* The minimum rate is 5%</div>
        </transition>
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

      <b-form-group :class="{ 'rate invalid': ui.dollarmessage, 'rate': !ui.dollarmessage }"
                    label="LoanAmount"
                    label-for="loan_amount_dollars">
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input id="loan_amount_dollars"
                        v-model="loan_amount_dollars"
                        type="number"
                        name="loan_amount_dollars"
                        step="1000"
                        @change="checkDollarValue"/>
        </b-input-group>
        <transition name="fade">
          <div v-if="ui.dollarmessage" class="message">* The minimum Loan amount is 50,000</div>
        </transition>
        
      </b-form-group>

      <b-button :disabled="ui.dollarmessage || ui.ratemessage" name="notSubmit" variant="primary" @click="clickSubmit">Submit</b-button>

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
      ui: {
        ratemessage: false,
        dollarmessage: false,
        addressMessage: false
      }
    }
  },
  //Form validation occurs on the fly and also auto corrects the minimum fields and informs the user of the minimum value
  //Because of the autocorrect we need to inform the user and prevent the form from being submitted before the user sees the message
  methods: {
    //Check the minimum rate
    //reset to min and display message to user. The message will fade out after time
    checkRate: function() {
      if (rate.value < 5) {
        this.rate = 5 //Set the value to the minimum
        this.ui.ratemessage = true
        setTimeout(() => (this.ui.ratemessage = false), 1000)
      }
    },
    //Check the minimum loan amount
    //reset to min and display message to user. The message will fade out after time
    checkDollarValue: function() {
      if (this.loan_amount_dollars < 50000) {
        this.loan_amount_dollars = 50000 //set the value to the minimum
        this.ui.dollarmessage = true
        setTimeout(() => (this.ui.dollarmessage = false), 1000)
      }
    },
    //Simple address validation
    //Message will display until user starts inputing
    checkAddress: function() {
      if (!this.address) {
        this.ui.addressMessage = true
        //setTimeout(() => (this.ui.addressMessage = false), 1000)
      } else {
        this.ui.addressMessage = false
      }
    },
    //Returns true if form can be sumitted
    borrowIsValid: function() {
      this.checkRate()
      this.checkDollarValue()
      this.checkAddress()
      //Check to see if dollar and rate address messages are displayed.
      return this.address && !this.ui.dollarmessage && !this.ui.ratemessage
    },
    //Using a click submit to avoid a user hitting enter key and submitting the form
    //need the user to see the feedback text after auto correcting the value
    async clickSubmit(ev) {
      ev.preventDefault()
      if (this.borrowIsValid()) {
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
    },
    //Changing the button "name" attribute will allow to button to have a seperate click event than ths "submit" event,
    //this way a user hitten enter after typing a field to set the value won't submit the form before they are done
    async onSubmit(ev) {
      console.log(ev)
      ev.preventDefault()
    }
  }
}
</script>
<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-leave-active {
  transition: opacity 2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.message {
  color: #f16f22;
}
.invalidmessage {
  height: 0;
  overflow: hidden;
  color: #f16f22;
  opacity: 0;
  -webkit-transition: opacity 200ms ease-in-out;
  -moz-transition: opacity 200ms ease-in-out;
  -ms-transition: opacity 200ms ease-in-out;
  -o-transition: opacity 200ms ease-in-out;
}
.invalid .invalidmessage {
  height: auto;
  opacity: 1;
}
</style>
