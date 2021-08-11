<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>
    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <b-form :data="investment.id" @submit="onSubmit">
        <b-form-group
          label-for="fund_amount_dollars">
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">$</span>
            </b-input-group-prepend>
            <b-form-input id="fund_amount_dollars"
                          v-model="fund_amount_dollars.value"
                          type="number"
                          name="fund_amount_dollars"
            />
          </b-input-group>
          <span
            v-show="fund_amount_dollars.inValid"
            class="error-msg"
            v-text="fund_amount_dollars.message"
          />
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </section>
    <div v-show="showAlert"
         :class="{'alert--failure': error, 'alert--success': !error, 'alert--info': funded === 'fully'}"
         class="alert">
      <span class="alert--closebtn" @click="showAlert = false">&times;</span>
      <span v-if="!error && funded !== 'fully'">
        <strong>Congrats!</strong> You successfully funded {{ investment.address }} with {{ funded }}
      </span>
      <span v-else-if="funded === 'fully'">
        Sorry, this project is fully funded.
      </span>
      <span v-else>
        <strong>Warning!</strong> There was an error submitting your funding request.
      </span>
    </div>
    <p>
      <b-button type="button" vairant="success" @click="goBack">
        Back
      </b-button>
    </p>

  </b-container>
</template>
<script>
export default {
  async asyncData({ $axios, params }) {
    const investment = await $axios.get(`/api/investment/${params.id}`)
    const funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data
    }
  },
  data() {
    return {
      showAlert: false,
      alert: null,
      error: false,
      funded: null,
      fund_amount_dollars: {
        value: '',
        inValid: false,
        message: 'Field is required'
      },
      investment: null
    }
  },
  methods: {
    async onSubmit(ev) {
      ev.preventDefault()
      if (this.fund_amount_dollars.value === '') {
        this.fund_amount_dollars.inValid = true
        return false
      }
      const funding = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: {
          investment_id: this.investment.id,
          amount: this.fund_amount_dollars.value
        }
      })
      if (funding.status === 200) {
        if (funding.data.fully_funded === 1) {
          this.funded = 'fully'
        } else {
          this.funded = `$${new Intl.NumberFormat('en-US', {
            style: 'decimal'
          }).format(this.fund_amount_dollars.value)}`
        }
      } else {
        this.error = true
      }
      this.showAlert = true
      this.fund_amount_dollars.value = ''
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style scoped>
.investment_funds {
  margin: 2em 0 2em;
  width: 33%;
}

.alert {
  padding: 20px;
  background-color: #f44336;
  color: white;
  opacity: 1;
  transition: opacity 0.6s;
  margin-bottom: 25px;
}

.alert--success {
  background-color: rgba(0, 128, 0, 0.98);
}

.alert--failure {
  background-color: red;
}

.alert--info {
  background-color: #40a6cc;
}

.alert--closebtn {
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.alert--closebtn:hover {
  color: black;
}
</style>
