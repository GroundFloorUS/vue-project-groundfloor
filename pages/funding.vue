<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <div class="row">
      <div class="funding-list">
        <div v-for="investment in funding" :key="investment.id" class="fund col-sm">
          <div>
            <div class="title"><h2>Type: {{ investment.purpose }}</h2></div>
            <div class="invementBody">
              <img class="content-image" src="~/assets/Smart-Investment.png">
            </div>
            <div class="info">
              <div class="col-6">
                <p>
                  <strong>Address:</strong> 
                  <nuxt-link :to="'/investment/' + investment.id">
                    {{ investment.address }}
                  </nuxt-link>
                </p>
                <p>
                  <strong>Amount:</strong> ${{ investment.loan_amount_dollars }}
                </p>
                <p>
                  <strong>Rate:</strong> {{ investment.rate }}%
                </p>

                <router-link :to="'/investment/' + investment.id">
                  <b-button size="md" variant="primary">
                    Invest
                  </b-button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  }
}
</script>
<style>
.fund {
  border: 1px solid blue;
  box-shadow: 0 1px 0 1px;
  margin: 15px;
  background-color: white;
}
</style>
