<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <b-table :items="funding" :fields="fields" striped hover @row-clicked="navigate" />
  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    const funds = await Promise.all(
      funding.data.map(
        async fund => await $axios.get(`/api/investment/${fund.id}/funds`)
      )
    )
    funding = funding.data.map((fund, index) => {
      return {
        ...fund,
        amount_funded: funds[index].data.reduce(
          (accumulator, fund) => accumulator + fund.amount,
          0
        )
      }
    })

    return {
      funding,
      fields: [
        {
          key: 'purpose',
          sortable: true
        },
        {
          key: 'address',
          sortable: true
        },
        {
          key: 'rate',
          sortable: true
        },
        {
          key: 'expected_term_months',
          sortable: true
        },
        {
          key: 'loan_amount_dollars',
          sortable: true
        },
        {
          key: 'amount_funded',
          sortable: true
        }
      ]
    }
  },
  methods: {
    navigate(item) {
      this.$router.push({ path: `/investment/${item.id}` })
    }
  }
}
</script>
