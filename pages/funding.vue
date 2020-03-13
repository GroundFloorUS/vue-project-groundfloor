<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <b-row>
      <template v-for="(investment, index) in funding">
        <b-col
          :key="index"
          cols="12"
          md="6"
          lg="4"
        >
          <b-card
            tag="article"
            class="mb-2 card"
            @click="$router.push('/investment/' + investment.id)"
          >
            <b-card-text>
              {{ investment.address }}
              <b-row>
                <b-col>
                  <span class="label">Rate: </span> <br> <span class="info">{{ investment.rate }}%</span>
                </b-col>
                <b-col>
                  <span class="label">Loan Amount:</span>  <br> <span class="info">{{ formatter.format(investment.loan_amount_dollars) }}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span class="label">Purpose: </span> <br> <span class="info">{{ investment.purpose }}</span>
                </b-col>
                <b-col>
                  <span class="label">Term: </span> <br> <span class="info">{{ investment.expected_term_months }} months</span>
                </b-col>
              </b-row>
              <b-progress
                :max="investment.loan_amount_dollars"
                height="30px"
                show-progress
              >
                <b-progress-bar
                  :value="investment.funded_amt"
                  :label="`${((investment.funded_amt / investment.loan_amount_dollars) * 100).toFixed(0)}%`"
                  :variant="'primary'"
                />
              </b-progress>
            </b-card-text>
          </b-card>
        </b-col>
      </template>
    </b-row>
  </b-container>
</template>

<script>
import { formatter } from '~/static/utils'
export default {
  data() {
    return {
      formatter
    }
  },
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  }
}
</script>
<style scoped>
.label {
  color: #626e83;
  font-size: 12px;
}
.info {
  font-size: 14px;
}
.card {
  cursor: pointer;
}
</style>
