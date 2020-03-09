<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <Investment v-for="investment in funding" :key="investment.id" :investment="investment" />
  </b-container>
</template>

<script>
import Investment from '../components/Investment'
export default {
  components: { Investment },
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  }
}
</script>

<style scoped>
ul {
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
}

li {
  margin-bottom: 10px;
  list-style: none;
  flex: 1 0 50%;
}

@media screen and (max-width: 800px) {
  li {
    flex: 1 0 100%;
  }
}
</style>
