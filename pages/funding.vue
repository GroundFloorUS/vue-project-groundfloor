<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <div class="funding-list">
      <FundItem v-for="investment in funding" :key="investment.id" :item="investment" />
    </div>
  </b-container>
</template>

<script>
import FundItem from './fundItem.vue'
export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  },
  components: {
    FundItem
  }
}
</script>
<style scoped>
h2 {
  padding-bottom: 10px;
}
.funding-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.funding-list div {
  width: 49%;
  margin-bottom: 20px;
}
</style>
