<template>
  <b-container>
    <b-row>
      <h2 class="title">FUNDING</h2>
      <ul class="funding-list">
        <li v-for="investment in funding" :key="investment.id">
          <b-col>
            <BIconHouse font-scale="2" />
            <span>
              <nuxt-link :to="'/investment/' + investment.id">Location: {{ investment.address }}</nuxt-link>
            </span>
          </b-col>
          <b-col>
            <span>Purpose: {{ investment.purpose }}</span>
          </b-col>
          <b-col>
            <span>Funding Needed: {{ investment.loan_amount_dollars }}</span>
          </b-col>
        </li>
      </ul>
    </b-row>
  </b-container>
</template>

<script>
import { BIcon, BIconHouse, BIconHouseFill } from 'bootstrap-vue'
export default {
  components: {
    BIcon,
    BIconHouse,
    BIconHouseFill
  },
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  }
}
</script>
