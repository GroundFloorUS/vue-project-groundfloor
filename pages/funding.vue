<template>
  <b-container class="mt-5">
    <h2 class="title mb-3">Loans awaiting funding</h2>
    <p class="mb-5">View projects from Groundfloor borrowers that are awaiting funding. Thousands of investors are earning an average return of 12%.</p>
    <b-row class="justify-content-center">
      <template v-for="investment in funding" >
        <b-card :key="investment.id" class="fundingCard">
          <b-row align-v="center" class="mb-3 align-content-sm-start align-content-md-between">
            <b-col class="mr-auto">
              <h4><b-badge pill variant="primary" class="purpose">{{ investment.purpose }}</b-badge></h4>
            </b-col>
            <b-col>
              <div class="timestamp">{{ getTimeSince(investment.created_on) }}</div>
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

          <b-button variant="outline-primary" class="float-right ">
            <nuxt-link :to="'/investment/' + investment.id" class="card-link stretched-link">
              View
            </nuxt-link>
          </b-button>
        </b-card>
      </template>
    </b-row>
  </b-container>
</template>

<script>
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
      console.log(date)
      const d = new Date(date)
      console.log(d)
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
</style>
