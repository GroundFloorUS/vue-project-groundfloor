<template>
  <b-container>
    <h2 class="title">FUNDED</h2>

    <ul class="funded-list">
      <li v-for="investment in funded" :key="investment.id">
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
    let funded = await $axios.get('/api/funded')
    return {
      funded: funded.data
    }
  }
}
</script>

<style lang="scss">
ul.funded-list {
  list-style: none;
  li {
    padding-bottom: 10px;
  }
}
</style>
