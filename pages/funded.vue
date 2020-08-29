<template>
  <b-container>
    <h2 class="title">FUNDED</h2>
    <div v-for="investment in funded" :key="investment.id">
      <b-list-group-item>
        <span class="font-weight-bolder">Address: </span>
        {{ investment.address }} <br>
        <span class="font-weight-bolder">Purpose: </span> {{ investment.purpose }}<br>
        <span class="font-weight-bolder">Created on: </span> {{ new Date(investment.created_on).toLocaleDateString() }}<br>
        <span class="font-weight-bolder">Balance: </span> {{ new Intl.NumberFormat('en', {style: 'currency', currency: 'USD'}).format(investment.loan_amount_dollars) }} <b-icon icon="check" variant="success"/><span class="text-success">This loan is fully funded</span>
      </b-list-group-item>
    </div>

  </b-container>
</template>
<style>
span,
h2 {
  color: #343a40;
}
a {
  color: #68b6c8;
}
.list-group div:nth-child(even) .list-group-item {
  background: #f5f5f5;
}
</style>
<script>
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default {
  async asyncData({ $axios }) {
    let funded = await $axios.get('/api/funded')
    return {
      funded: funded.data
    }
  }
}
</script>
