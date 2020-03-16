<template>
  <b-container>
    <h2 class="title">FUNDED</h2>
    <InvestmentTable :investments="funded" />
  </b-container>
</template>

<script>
import InvestmentTable from '../components/InvestmentTable.vue'

export default {
  components: {
    InvestmentTable
  },
  async asyncData({ $axios }) {
    let funded = await $axios.get('/api/funded')
    return {
      funded: funded.data
    }
  }
}
</script>
