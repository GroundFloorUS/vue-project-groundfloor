<template>
  <b-container class="mt-md-5">
    <h2 class="title mb-3">Loans awaiting funding</h2>
    <p class="mb-md-5 mb-sm-3">View projects from Groundfloor borrowers that are awaiting funding. Thousands of investors are earning an average return of 12%.</p>
    <b-row class="justify-content-center">
      <template v-for="investment in funding" >
        <b-card :key="investment.id" class="fundingCard">
          <b-row align-v="center" class="mb-3 align-content-sm-start align-content-md-between">
            <b-col class="mr-auto d-none d-md-block">
              <h4><b-badge pill variant="primary" class="purpose">{{ investment.purpose }}</b-badge></h4>
            </b-col>
          </b-row>
          <b-card-text>
            <h3 class="address">{{ investment.address }}</h3>
            <b-row>
              <b-col>
                <p><strong>rate:</strong> {{ investment.rate }}%</p>
              </b-col>
              <b-col>
                <p><strong>projected term:</strong> {{ investment.expected_term_months }} mo.</p>
              </b-col>
            </b-row>
          </b-card-text>

          <b-progress :value="10000" :max="investment.loan_amount_dollars" variant="secondary" class="mb-1" />
          <p><strong>$10,000</strong> <span>funded</span></p>

          <b-row align-v="center" class="mb-3 align-content-between no-gutters">
            <div class="timestamp">{{ getTimeSince(investment.created_on) }}</div>
            <b-button variant="outline-primary" class="ml-auto">
              <nuxt-link :to="'/investment/' + investment.id" class="card-link stretched-link">
                View
              </nuxt-link>
            </b-button>
          </b-row>
        </b-card>
      </template>
    </b-row>
  </b-container>
</template>

<script>
// {
//   "id": 2,
//   "purpose": "Purchase",
//   "address": "2733 Pepperdine Dr.",
//   "rate": 10,
//   "expected_term_months": 12,
//   "loan_amount_dollars": 100000,
//   "fully_funded": 0,
//   "created_on": "2020-08-26 21:22:00"
// }
export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  },
  methods: {
    /**
     * Gets a date and generates a sentence indicating the amount of time
     * that has passed since that date.
     * TODO: Currently dates are saving several hours ahead of my current time zone.
     * TODO: This should be replaced by a more robust system like moment.js
     */
    getTimeSince(date) {
      const d = new Date(date)
      let seconds = Math.floor((new Date() - d) / 1000)
      let interval = Math.floor(seconds / 31536000)

      if (interval > 1) {
        return interval + ' years ago'
      }
      interval = Math.floor(seconds / 2592000)
      if (interval > 1) {
        return interval + ' months ago'
      }
      interval = Math.floor(seconds / 86400)
      if (interval > 1) {
        return interval + ' days ago'
      }
      interval = Math.floor(seconds / 3600)
      if (interval > 1) {
        return interval + ' hours ago'
      }
      interval = Math.floor(seconds / 60)
      if (interval > 1) {
        return interval + ' minutes ago'
      }
      return 'a few seconds ago'
    }
  }
}
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 4rem;
  color: #3c485c;
}
.card.fundingCard {
  border-radius: 1rem;
  padding: 1.5rem;
  width: 550px;
  margin: 0 1rem 1rem 0;
  transition: all 0.2s ease-out;
}
.card.fundingCard:hover {
  border-color: #007bff;
  transform: translate(0, -5px);
}
.card.fundingCard a {
  color: inherit;
}
.card.fundingCard .purpose {
  padding: 0.5em 1em;
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.card.fundingCard .timestamp {
  text-align: right;
}
.card.fundingCard .progress {
  border-radius: 1rem;
}

@media only screen and (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  .card.fundingCard {
    border-radius: 0;
    padding: 0.2rem;
    width: 100%;
    margin: 0;
    transition: unset;
  }
  .card.fundingCard:hover {
    border-color: rgba(0, 0, 0, 0.125);
    transform: translate(0, 0);
  }
  .card.fundingCard .timestamp {
    text-align: left;
  }
  .card.fundingCard .address {
    font-size: 1.25rem;
    font-weight: 700;
  }
}
</style>
