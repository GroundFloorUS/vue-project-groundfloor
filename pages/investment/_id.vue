<template>
  <b-container class="loan-details">
    <b-jumbotron
      :lead="investment.address"
      header="Loan Details"
      header-tag="h1"
      bg-variant="info"
      text-variant="light"
    >
      <div class="loan-details__back">
        <nuxt-link
          to="/funding"
          class="btn btn-outline-light"
        >
          &laquo; Back to Funding
        </nuxt-link>
      </div>
    </b-jumbotron>

    <div class="loan-details__body">

      <aside class="loan-details__sidebar">

        <b-card
          :title="`${fundsPercentage}% Funded`"
          :sub-title="`${funds.length} Investors`"
        >
          <b-progress
            :value="fundsPercentage"
            variant="success"
            striped
            animated
          />
        </b-card>

        <b-card
          :title="`$${investment.loan_amount_dollars} Loan`"
          :sub-title="`$${fundsTotal} funded`"
        >
          <div><strong>Rate:</strong> {{ investment.rate }}%</div>
          <div><strong>Term:</strong> {{ investment.expected_term_months }} Months</div>
          <div><strong>Purpose:</strong> {{ investment.purpose }}</div>

          <div class="loan-details__funds">
            <b-badge
              v-for="fund in funds"
              :key="fund.id"
              variant="success"
              pill
            >
              ${{ fund.amount }}
            </b-badge>
          </div>
        </b-card>
      </aside>

      <div class="loan-details__main">

        <h2 class="title">Invest in this loan</h2>

        <b-form
          class="loan-details__form"
          novalidate
          @submit.prevent="handleSubmit"
        >
          <b-form-group
            :state="isAmountValid"
            :validated="isSubmitted"
            :invalid-feedback="amountInvalidFeedback"
            label=""
            label-for="amount">
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text">$</span>
              </b-input-group-prepend>
              <b-form-input
                id="amount"
                v-model="amount"
                min="10"
                step="10"
                type="number"
                name="amount"
              />
            </b-input-group>
          </b-form-group>

          <b-button
            class="loan-details__submit"
            type="submit"
            variant="success"
          >
            <strong>Invest!</strong>
          </b-button>
        </b-form>
      </div>

    </div>

  </b-container>
</template>

<style lang="scss">
  .loan-details {
    &__back {
      margin-top: 2rem;
    }

    &__main {
      flex: 1 1 auto;

      .title {
        margin-bottom: 1.5rem;
      }
    }

    &__form {
      max-width: 300px;
    }

    &__sidebar {
      > * + * {
        margin-top: 2rem;
      }
    }

    &__submit {
      margin-top: 1.5rem;
    }

    &__funds {
      margin-top:.5rem;

      > * {
        margin-right:.4rem;
      }
    }

    @media screen and (max-width:599px) {
      &__main {
        margin-top:2rem;
      }
    }

    @media screen and (min-width:600px) {
      &__body {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        > * + * {
          margin-left: 2rem;
        }
      }

      &__sidebar {
        width: 300px;
      }
    }
  }
</style>

<script>
  export default {
    data() {
      return {
        amount: 10,
        isSubmitted: false
      }
    },
    asyncData({ $axios, params }) {
      return new Promise((resolve, reject) => {
        Promise.all([
          $axios.get(`/api/investment/${params.id}`),
          $axios.get(`/api/investment/${params.id}/funds`)
        ])
          .then(([investmentResponse, fundsResponse]) => {
            resolve({
              investment: investmentResponse.data,
              funds: fundsResponse.data
            })
          })
          .catch(reject)
      })
    },
    computed: {
      fundsTotal() {
        return this.funds.reduce((total, fund) => total + fund.amount, 0)
      },
      fundsPercentage() {
        return Math.floor(this.fundsTotal / this.investment.loan_amount_dollars * 100)
      },
      isAmountValid() {
        return this.isSubmitted ? this.amount >= 10 : null
      },
      amountInvalidFeedback() {
        return 'Please enter a loan amount of at least $10'
      }
    },
    methods: {
      handleSubmit() {
        this.isSubmitted = true

        const payload = {
          investment_id: this.investment.id,
          amount: this.amount
        }

        if (this.isAmountValid) {
          this.$axios.post('/api/funding', payload)
            .then((response) => {
              console.warn('???', response.data)
              this.isSubmitted = false
              // TODO : reset form?

              this.$axios.get(`/api/investment/${this.investment.id}/funds`)
                .then(({ data }) => {
                  this.funds = data
                })
                .catch((e) => {
                  console.error(e)
                  // TODO error handling with toast
                })
            })
            .catch((e) => {
              console.error(e)
              // TODO error handling with toast
            })
        }
      }
    }
  }
</script>
