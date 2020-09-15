<template>
  <b-container>
    <h2 class="title">FUNDED</h2>
    <div v-for="investment in funded" :key="investment.id" class="my-3">
      <nuxt-link :to="'/investment/' + investment.id" style="text-decoration: none; color: inherit;">
        <b-card
          :title="`Address: ${investment.address} `"
          border-variant="secondary"
          header-border-variant="secondary"
        >
          <b-card-text class="container">
            <p>loan amount:
              {{ investment.loan_amount_dollars }}
            </p>
          </b-card-text>
        </b-card>
      </nuxt-link>
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
