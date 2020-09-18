<template>
  <b-container>
    <h2 class="title">FUNDING</h2>

    <div>
      <b-table :fields="fields" :items="funding" striped hover>
        <template v-slot:cell(address)="data">
          <nuxt-link :to="'/investment/' + data.item.id">
            {{ data.item.address }}
          </nuxt-link>
        </template>
        <template v-slot:cell(rate)="data">
          {{ data.item.rate + '%' }}
        </template>
        <template v-slot:cell(expected_term_months)="data">
          {{ data.item.expected_term_months + ' months' }}
        </template>
      </b-table>
    </div>
  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data,
      fields: [
        'purpose',
        'address',
        'rate',
        {
          key: 'expected_term_months',
          label: 'Expected Term'
        },
        {
          key: 'loan_amount_dollars',
          label: 'Loan Amount',
          formatter: 'formatCurrency'
        },
        {
          key: 'fully_funded',
          label: 'Fully Funded?',
          formatter: 'formatFunded'
        },
        {
          key: 'created_on',
          formatter: 'formatDate'
        }
      ]
    }
  },
  methods: {
    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      })

      return formatter.format(value)
    },
    formatFunded(value) {
      return value == 1 ? 'Yes' : 'No'
    },
    formatDate(value) {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return ''
      } else {
        return date.toLocaleString()
      }
    }
  }
}
</script>
