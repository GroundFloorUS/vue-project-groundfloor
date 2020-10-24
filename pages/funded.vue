<template>
  <b-container>
    <h2 class="title">FUNDED</h2>
    <loan-list :investments="investments">

      <template #empty-text>
        <p>There are no loans that have been fully funded. Check back soon.</p>
        <p>Or you could <nuxt-link to="/funding">check out open investments to fund</nuxt-link>!</p>
      </template>

      <template #component="{ investment }">
        <loan-card :investment="investment" :show-progress="false" />
      </template>
    
    </loan-list>

  </b-container>
</template>

<script>
import LoanCard from '~/components/LoanCard.vue'
import LoanList from '~/components/LoanList.vue'

export default {
  async asyncData({ $axios }) {
    let funded = await $axios.get('/api/funded')
    return {
      investments: funded.data
    }
  },
  components: { LoanCard, LoanList }
}
</script>
