<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <div class="table">
      <div class="th">
        <div class="td">Address</div>
        <div class="td">Funding Amount</div>
        <div class="td">Purpose</div>
        <div class="td">Rate</div>
        <div class="td">Terms in Months</div>
        <div class="td">% Funded</div>
      </div>
      <div v-for="investments in funding" :key="investments.id" class="tr" >
        <div class="td left">
          <nuxt-link :to="'/investment/' + investments.id">
            {{ investments.address }}
          </nuxt-link>
        </div>
        <div class="td">{{ investments.loan_amount_dollars | currency }}</div>
        <div class="td left">{{ investments.purpose }}</div>
        <div class="td">{{ investments.rate }}%</div>
        <div class="td">{{ investments.expected_term_months }}</div>
        <div class="td">{{ percentFunded(investments.loan_amount_dollars, investments.total_funded) }} {{ funding.amount }}</div>
      </div>
    </div>
  </b-container>
</template>

<script>
import { currencyFilter, rateFilter } from '../shared/number-filters'

export default {
  filters: {
    currency: currencyFilter,
    rate: rateFilter
  },
  async asyncData({ $axios, params }) {
    const funding = await $axios.get('/api/funding/').catch(error => {
      console.log(error)
    })

    return {
      funding: funding.data
    }
  },
  methods: {
    percentFunded(wholeAmount, partAmount) {
      return `${Number.parseFloat(
        (Number(partAmount) / Number(wholeAmount)) * 100
      ).toFixed(2)}%`
    }
  }
}
</script>

<style scoped>
.table {
  display: flex;
  flex-flow: column nowrap;
  font-size: 1rem;
  margin: 0.5rem;
  line-height: 1.5;
  border-bottom: 1px solid #d0d0d0;
  flex: 1 1 auto;
}

.th {
  display: flex;
  font-weight: 700;
  background-color: #f2f2f2;
}

.th > .td {
  white-space: normal;
  justify-content: center;
}

.tr {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
}

.tr:nth-of-type(even) {
  background-color: #ffffff;
}

.tr:nth-of-type(odd) {
  background-color: #f2f2f2;
}

.td {
  display: flex;
  flex-flow: row nowrap;
  flex-grow: 1;
  flex-basis: 0;
  padding: 0.5em;
  word-break: break-word;
  overflow: visible;
  text-overflow: ellipsis;
  min-width: 0px;
  white-space: nowrap;
  border-bottom: 1px solid #d0d0d0;
  justify-content: center;
}

.td.left {
  justify-content: left;
}
</style>
