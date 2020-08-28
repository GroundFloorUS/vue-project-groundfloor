<template>
  <b-container>
    <b-row>
      <b-col class="mr-auto" align-v="start">
        <b-row align-v="center">
          <b-col>
            <h1 class="address">{{ investment.address }}</h1>
          </b-col>
        </b-row>
        <b-row align-v="center" class="mb-3 align-content-sm-start align-content-md-between">
          <b-col class="mr-auto">
            <h4><b-badge pill variant="primary" class="purpose">{{ investment.purpose }}</b-badge></h4>
          </b-col>
        </b-row>
      </b-col>
      <div>
        <b-button v-b-modal.modalFund size="lg" variant="success">Fund this loan</b-button>
      </div>
    </b-row>
    <b-row class="no-gutters">
      <p class="mr-4 my-4"><strong>rate:</strong> {{ investment.rate }}%</p>
      <p class="mr-4 my-4"><strong>projected term:</strong> {{ investment.expected_term_months }} mo.</p>
    </b-row>
    <b-progress :value="investment.funded" :max="investment.loan_amount_dollars" variant="secondary" class="mb-1" />
    <p class="text-right mb-5"><strong>${{ investment.funded || 0 }}</strong> / ${{ investment.loan_amount_dollars }} funded in the past <time-stamp :date="investment.created_on" :responsive="false" /></p>
    <div>
      <validation-observer v-slot="{ handleSubmit }" ref="observer" slim>
        <b-modal id="modalFund" ref="modalFund" centered size="sm" title="Fund Amount" @ok.prevent="handleSubmit(onSubmit)" @shown="focusField">
          <b-container fluid>
            <b-row>
              <b-col>
                <!-- amount -->
                <validation-provider
                  v-slot="validationContext"
                  :rules="{ required: true, min_value: 1, max_value: toBeFunded }"
                  name="fund amount"
                >
                  <b-form-group>
                    <b-input-group class="mb-4">
                      <b-input-group-prepend>
                        <span class="input-group-text">$</span>
                      </b-input-group-prepend>
                      <b-form-input
                        id="amount"
                        ref="amount"
                        v-model="amount"
                        :state="getValidationState(validationContext)"
                        type="number"
                        name="amount"
                        aria-describedby="amount-live-feedback"
                      />
                      <b-form-invalid-feedback id="amount-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                    <b-alert v-if="amount == toBeFunded" variant="success" class="mb-0" show>You're about to fully fund this loan! 🙌</b-alert>
                  </b-form-group>
                </validation-provider>
              </b-col>
            </b-row>
          </b-container>
        </b-modal>
      </validation-observer>
    </div>

    <section class="investment_funds mb-5">
      <template v-if="funds.length > 0">
        <h3 class="subtitle">Loan Funds</h3>

        <b-row>
          <template v-for="fund in funds" >
            <b-col :key="fund.id" cols="12" md="6" lg="4">
              <b-card bg-variant="secondary" text-variant="white" class="text-center fundCard mb-4">
                <b-container fluid>
                  <p class="nobr"><strong>${{ fund.amount }}</strong> <span>funded</span></p>
                  <time-stamp :date="fund.created_on" :responsive="false" /> ago
                </b-container>
              </b-card>
            </b-col>
          </template>
        </b-row>
      </template>
      <template v-else>
        <b-jumbotron class="text-center my-5">
          <h4 class="mb-4"><strong>Looks like you're one of the first people to check out this investment!</strong></h4>
          <p><b-button v-b-modal.modalFund variant="success" class="mr-2">click here</b-button>to fund it!</p>
        </b-jumbotron>
      </template>

    </section>
    <p class="text-center">
      <b-button type="button" variant="outline-primary" @click="goBack">
        Go Back
      </b-button>
    </p>
  </b-container>
</template>
<script>
// amount: 1234
// created_on: "2020-08-27 13:29:03"
// id: 1
// investment_id: 4
import {
  ValidationProvider,
  ValidationObserver
} from 'vee-validate/dist/vee-validate.full'
import timeStamp from '~/components/timestamp.vue'

export default {
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data
    }
  },
  components: {
    'validation-observer': ValidationObserver,
    'validation-provider': ValidationProvider,
    'time-stamp': timeStamp
  },
  data() {
    return {
      amount: '',
      showTopToast: false
    }
  },
  computed: {
    toBeFunded() {
      const vm = this
      return (
        vm.investment.loan_amount_dollars - vm.investment.funded ||
        vm.investment.loan_amount_dollars
      )
    }
  },
  created() {
    console.log(this.funds)
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    focusField() {
      this.$refs.amount.focus()
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },
    hideModal() {
      this.$refs.modalFund.hide()
    },
    async onSubmit(ev) {
      const vm = this
      let { amount, investment } = this
      let b = {
        investment_id: investment.id,
        amount
      }
      let funding = await this.$axios({
        method: 'post',
        url: '../api/funding',
        data: b
      }).then(res => {
        vm.hideModal()
        vm.amount = ''
        console.log(res)
        if (res.data.message) {
          vm.hideModal()
          vm.amount = ''
          vm.$bvToast.toast(res.data.message, {
            title: 'Whoops!',
            toaster: 'b-toaster-top-full',
            solid: true,
            appendToast: true,
            variant: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style>
.nobr {
  white-space: nowrap;
  margin-bottom: 0;
}
</style>
