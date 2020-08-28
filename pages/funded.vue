
<template>
  <b-container>
    <h2 class="title">FUNDED</h2>

    <div class="row"> 
      <div class="funded-list">
        <li v-for="investment in funded" :key="investment.id">
          <nuxt-link :to="'/investment/' + investment.id">
            {{ investment.address }}
          </nuxt-link>
          <p>
            {{ investment.loan_amount_dollars }}
          </p>
        </li>
      </div>
    </div>

  </b-container>
</template>
<script>
export default {
  async asyncData({ $axios }) {
    let funded = await $axios.get('/api/funded')
    return {
      funded: funded.data
    }
  }
}
</script>
