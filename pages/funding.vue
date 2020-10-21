<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <b-row>
      <b-col v-for="investment in funding" :key="investment.id">
        <investment-card :investment="investment" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import InvestmentCard from '../components/InvestmentCard'
export default {
  components: {
    InvestmentCard
  },
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  },
  filters: {
    formatDate(value) {
      let date = new Date(value)
      return date.toLocaleDateString()
    },
    formatDollars(value) {
      let parts = value.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    }
  }
}
</script>
