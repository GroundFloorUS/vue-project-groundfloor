<template>
  <b-table :items="investments"
           :fields="fields"
           :primary-key="id"
           :tbody-tr-class="rowClass"
           hover
           striped>
    <template v-slot:cell(address)="data">
      <nuxt-link :to="'/investment/' + data.item.id">
        {{ data.item.address }}
      </nuxt-link>
    </template>
    <template v-slot:cell(fully_funded)="data">
      {{ data.item.fully_funded ? 'Yes' : 'No' }}
    </template>
    <template v-slot:cell(rate)="data">
      {{ data.item.rate }}%
    </template>
    <template v-slot:cell(loan_amount_dollars)="data">
      ${{ data.item.loan_amount_dollars.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') }}
    </template>
    <template v-slot:cell(total_funding)="data">
      ${{ ('' + data.item.total_funding).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') }}
    </template>
  </b-table>
</template>

<script>
export default {
  props: { investments: { type: Array, required: true } },
  data() {
    let f = [
      { key: 'address', sortable: true },
      { key: 'rate', sortable: true },
      { key: 'expected_term_months', label: 'Length', sortable: true },
      { key: 'loan_amount_dollars', label: 'Loan Amount', sortable: true },
      { key: 'fully_funded', label: 'Funded', sortable: true }
    ]
    if (
      this.investments &&
      this.investments[0] &&
      this.investments[0].total_funding != null
    ) {
      f.push({ key: 'total_funding', label: 'Total Funding', sortable: true })
    }
    return {
      fields: f
    }
    /*
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }*/
  },
  methods: {
    rowClass(fund, type) {
      if (!fund || type !== 'row') return
      if (fund.fully_funded == 1) return 'table-success'
    }
  }
}
</script>
