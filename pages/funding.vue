<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <InvestmentTable :investments="funding" />
  </b-container>
</template>

<script>
import InvestmentTable from '../components/InvestmentTable.vue'

export default {
  components: {
    InvestmentTable
  },
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  }
}
</script>
