<template>
  <b-container>
    <h2 class="title">FUNDING</h2>

    <loan-list :investments="investments">

      <template #empty-text>
        <p>There aren't any loan requests to fund. Check back again soon!</p>
      </template>

      <template #component="{ investment }">
        <loan-card :investment="investment" />
      </template>
    
    </loan-list>

  </b-container>
</template>

<script>
import LoanCard from '~/components/LoanCard.vue'
import LoanList from '~/components/LoanList.vue'

export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      investments: funding.data
    }
  },
  components: { LoanCard, LoanList }
}
</script>
