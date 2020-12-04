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
      isSubmitted: false,
      address: '',
      grade: "A",
      rate: 10,
      expected_term_months: 12,
      loan_amount_dollars: 50000
    }
  },
  computed: {
    // Obviously this is very minimal validation, normally I'd add VeeValidate to Buefy so I was future-proof, but for the purposes of this exercise computed properties seems fine given the requirements
    isAddressValid() {
      return this.isSubmitted ? !!this.address : null;
    },
    isGradeValid() {
      return this.isSubmitted ? ['A', 'B', 'C', 'D', 'E', 'F', 'G'].include(this.grade) : null;
    },
    // But hey, if we're gonna do bare bones let's do it right. This is 100% overkill for this hardcoded string but using computed for these messages will give us some flexibility.
    addressInvalidFeedback() {
      return 'Please enter a valid address';
    },
    gradeInvalidFeedback() {
      return 'Please enter a valid grade';
    },
    isRateValid() {
      return this.isSubmitted ? this.rate > 5 : null;
    },
    // You could do stuff like this. Easter eggs and jokes are excellent to have...
    rateInvalidFeedback() {
      if (this.rate === 0) {
        return `C'mon we've gotta make *some* money here, be reasonable.`;
      } else if (this.rate < 0) {
        return `Please enter a positive number. By the way, you may not understand how loans work...`;
      } else if (isNaN(this.rate)) {
        return `Words are not numbers. I appreciate your business but I'm not sure where to start with this one.`;
      } else {
        return 'Please enter an interest rate of at least 5%';
      }
    },
    isAmountValid() {
      return this.isSubmitted ? this.loan_amount_dollars > 50000 : null;
    },
    amountInvalidFeedback() {
      return 'Please enter a loan amount of at least $50,000'
    },
    isFormValid() {
      return this.isAddressValid && this.isRateValid && this.isAmountValid
    },
  },
  methods: {
    // TODO : Move to Vuex, implement better api error handling
    onSubmit() {
      this.isSubmitted = true

      return new Promise((resolve, reject) => {
        if (this.isFormValid) {
          // I dunno if i'd normally destructure 'this', but if we're gonna let's go all the way
          let { grade, address, rate, expected_term_months, loan_amount_dollars, $axios, purpose } = this
          let data = {
            purpose: purpose.value,
            address,
            rate,
            grade,
            expected_term_months,
            loan_amount_dollars
          }

          $axios({
            method: 'post',
            url: '/api/investment',
            data,
          })
            .then(() => {
              this.$router.push({ path: '/funding' })
            })
            .catch(reject);
        } else {
          reject();
        }
      });
    }
  }
}
