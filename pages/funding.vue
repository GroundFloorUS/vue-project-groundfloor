<template>
  <b-container>
    <h2 class="title">FUNDING</h2>

    <ul class="funding-list">
      <li v-for="investment in funding" :key="investment.id">
        <FundCard :investment="investment"/>
      </li>
    </ul>
  </b-container>
</template>

<script>
import FundCard from '../components/FundCard'

export default {
  components: { FundCard },
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  }
}
</script>

<style lang="scss">
ul.funding-list {
  list-style: none;
  li {
    padding-bottom: 10px;
  }
}
</style>
