<template>
  <b-container>
    <h2 class="title">FUNDED</h2>
    <div class="investment-list">
      <Investment v-for="investment in funded" :key="investment.id" :investment="investment" />
    </div>
  </b-container>
</template>

<script>
import Investment from '../components/Investment'
export default {
  components: {
    Investment
  },
  async asyncData({ $axios }) {
    let funded = await $axios.get('/api/funded')
    return {
      funded: funded.data
    }
  }
}
</script>
