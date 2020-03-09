<template>
  <b-container>
    <h2 class="title">FUNDED</h2>

    <ul class="funded-list">
      <li v-for="investment in funded" :key="investment.id">
        <Investment :investment="investment" />
      </li>
    </ul>

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
