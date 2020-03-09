<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <Investment :investment="investment" />
    
    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <ul class="funding-list">
        <li v-for="fund in funds" :key="fund.id">
          <div>
            {{ fund.amount }}
          </div>
        </li>
      </ul>
    </section>

    <b-form v-if="!investment.fully_funded" @submit="onSubmit">
      <b-form-group label="Amount"
                    label-for="amount">
        <b-form-input id="amount"
                      v-model="amount"
                      name="amount" />
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
    
    <p>
      <b-button type="button" vairant="success" @click="goBack">
        Back
      </b-button>
    </p>

  </b-container>
</template>
<script>
import Investment from '../../components/Investment'
export default {
  components: { Investment },
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`) // potentially use investment
    return {
      investment: investment.data,
      funds: funds.data
    }
  },
  data() {
    return {
      amount: 0
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async onSubmit(ev) {
      ev.preventDefault()
      const data = {
        investment_id: this.investment.id,
        amount: Number(this.amount)
      }
      const fundingResponse = await this.$axios({
        method: 'post',
        url: `/api/funding`,
        data
      })
      if (fundingResponse.status === 200) {
        this.funds.push(data) // trigger event to update investment
      }
    }
  }
}
</script>
