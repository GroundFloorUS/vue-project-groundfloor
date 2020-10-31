<template>
  <div>
    <nuxt-link :to="'/investment/' + item.id">
      <b-card :title="item.address">
        <b-progress :class="{'funded' : item.fully_funded==1}" :label="`calculatePercent Funded`" :value="calculatePercent" :max="100" class="mb-3" height="30px" variant="success"/>
        <div class="percent_amount">{{ calculatePercent }}% Funded</div>
        <div class="inner-content">
          <b-card-text>
            <span class="label">Type: </span><span class="value">{{ item.purpose }}</span>
          </b-card-text>
          <b-card-text>
            <span class="label">Duration:</span><span class="value">{{ item.expected_term_months }}mo</span>
          </b-card-text>
          <b-card-text>
            <span class="label">Rate: </span><span class="value">{{ item.rate }}%</span>
          </b-card-text>
          <b-card-text>
            <span class="label">Amount:</span><span class="value">${{ amountParsed }}</span>
          </b-card-text>
        </div>
        <div class="details">View Details ></div>
        <!--<b-card-text>
          {{ item }}
        </b-card-text>-->
      </b-card>
    </nuxt-link>
  </div>
</template>
<script>
export default {
  name: 'FundItem',
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  computed: {
    amountParsed: function() {
      return this.addCommasToAmount(this.item.loan_amount_dollars)
    },
    calculatePercent: function() {
      if (this.item.fully_funded) return 100
      if (!this.item.sum) return 0
      let sum = this.item.sum * 1
      return Math.ceil((sum / this.item.loan_amount_dollars) * 100)
    }
  },
  methods: {
    addCommasToAmount: function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style scoped>
*:hover {
  text-decoration: none;
}
* {
  color: #313e46;
}
h4 {
  color: #409dc3;
}
.label {
  font-weight: bold;
}
.inner-content {
  display: flex;
  flex-wrap: wrap;
}
.card-text {
  width: 50%;
  border-bottom: 3px solid #dbdbdb;
  padding-bottom: 4px;
}
.card-text span {
  width: 50%;
  display: inline-block;
  vertical-align: top;
}
.card {
  position: relative;
  border-top-right-radius: 0;
  top: 0;
  left: 0;
  transition: all 200ms;
}
.card:hover {
  top: -5px;
  left: -5px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.18039);
}
.card:before {
  content: '';
  position: absolute;
  right: -13px;
  top: -3px;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;

  border-bottom: 20px solid #409dc3;
  transform: rotate(45deg);
}
.card-text:last-child {
  margin-bottom: 1rem;
}
.percent_amount {
  position: relative;
  top: -45px;
  font-weight: bold;
  left: 10px;
  margin-bottom: -25px;
}
.details {
  text-align: center;
  visibility: hidden;
  color: #409dc3;
}
.card:hover .details {
  visibility: visible;
}
.progress.funded >>> .bg-success {
  background: rgb(251, 218, 25);
  background: linear-gradient(
    180deg,
    rgba(251, 218, 25, 1) 0%,
    rgb(255 188 0) 100%
  );
}
</style>
