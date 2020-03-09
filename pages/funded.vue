<template>
  <b-container>
    <h2 class="title">FUNDED</h2>

    <ul class="funded-list">
      <li v-for="investment in funded" :key="investment.id">
        <p>
          Purpose: {{ investment.purpose }}
        </p>
        <p>
          Address: {{ investment.address }} 
        </p>
        <p>
          Rate: {{ investment.rate }}%
        </p>
        <p>
          Expected Term: {{ investment.expected_term_months }} Months
        </p>
        <p>
          Loan Amount (Dollars): ${{ investment.loan_amount_dollars }}&nbsp;
          <b-button type="button" vairant="success" @click="investments(investment.id)">
            Investments
          </b-button>
        </p>
      </li>
    </ul>

  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let funded = await $axios.get('/api/funded')
    return {
      funded: funded.data
    }
  },
  methods: {
    investments(id) {
      document.location.href = '/investment/' + id
    }
  }
}
</script>
<style>
.funded-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.funded-list > li {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border: 5px solid #ccc;
  padding: 10px 10px 0px 10px;
  margin-bottom: 10px;
}

.title {
  font: 400 40px/1.5 Helvetica, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
