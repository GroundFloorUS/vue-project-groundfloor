<template>
  <b-card>
    <b-card-sub-title>{{ investment.purpose }}</b-card-sub-title>
    <b-card-title class="pt-2">{{ investment.address }}</b-card-title>
    <b-card-sub-title>Created {{ investment.created_on | formatDate }}</b-card-sub-title>
    <b-card-text class="pt-4">
      <h2>${{ investment.loan_amount_dollars | formatDollars }}</h2>
      <h4 class="text-muted">{{ investment.rate }}% for {{ investment.expected_term_months }} Months</h4>
    </b-card-text>
    <nuxt-link :to="'/investment/' + investment.id">
      View Details 
    </nuxt-link>
  </b-card>
</template>

<script>
export default {
  props: {
    investment: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style>
</style>
