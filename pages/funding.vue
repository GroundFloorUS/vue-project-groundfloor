<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <b-row>
      <b-col v-for="investment in funding" :key="investment.id" cols="4" class="pb-4">
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
  }
}
</script>
