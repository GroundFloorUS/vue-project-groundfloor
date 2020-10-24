<template>
  <div class="loan-card">
    <h3 class="loan-card__title">{{ investment.address }}</h3>
    <div class="flex loan-card__primary-details">
      <div class="loan-card__purpose">Type: {{ investment.purpose }}</div>
      <div class="loan-card__date">Requested on: {{ investment.created_on | simpleDate }}</div>
    </div>

    <div v-if="showProgress" class="loan-card__progress"><strong>Investment Progress</strong>
      <b-progress max="100" height="2rem" show-progress animated variant="success">
        <b-progress-bar :value="fundedPercent">
          <span><strong>{{ fundedPercent }}%</strong></span>
        </b-progress-bar>
        
      </b-progress>
    </div>
    
    <div class="flex">
      <div>
        Amount: <span v-if="showProgress">${{ (investment.funded || 0) | commafy }} of </span>${{ investment.loan_amount_dollars | commafy }}
      </div>
      <div>
        Term: {{ investment.expected_term_months }} months
      </div>
      <div>
        Rate: {{ investment.rate }}%
      </div>
    </div>
    <div class="loan-card__return">
      <span>Total Expected Return: </span>
      <span class="loan-card__total">
        ${{ totalReturn | commafy }}
      </span>
    </div>
  </div>
</template>

<script>
function calculatedReturn(amount, rate, term) {
  return Math.floor(Number(amount) * (Number(rate) / 100) * (Number(term) / 12))
}
export default {
  props: {
    investment: {
      type: Object,
      required: true
    },
    showProgress: { type: Boolean, default: true }
  },
  computed: {
    totalReturn() {
      return calculatedReturn(
        this.investment.loan_amount_dollars,
        this.investment.rate,
        this.investment.expected_term_months
      )
    },
    fundedPercent() {
      return Math.round(
        (this.investment.funded / this.investment.loan_amount_dollars) * 100
      )
    }
  }
}
</script>
<style scoped>
.loan-card {
  color: #343a40;
  padding: 1rem;
  border-radius: 4px;
  background: whitesmoke;
  border: 1px solid lightgray;
  margin: 1rem 0;
}
a:hover .loan-card__title {
  color: #40a6cc;
}
.loan-card__primary-details {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ededed;
  font-weight: bold;
  font-size: 13px;
}
.loan-card__progress {
  margin: 1rem 0;
}
.loan-card__return {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ededed;
}
.loan-card__total {
  color: #41b883;
  font-size: 18px;
  font-weight: 600;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
@media screen and (max-width: 600px) {
  .flex {
    display: block;
  }
}
</style>
