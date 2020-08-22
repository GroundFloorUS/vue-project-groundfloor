<template>
  <b-container>
    <b-jumbotron>
      <h1 class="title">
        <logo />
      </h1>
      <h3 class="subtitle">Sample interview project for GROUNDFLOOR</h3>

      <b-container class="invest-action-buttons">
        <b-row>
          <b-col>
            <b-button
              data-cy="fund-loan-button"
              size="lg"
              variant="success"
              @click="goFunding"
            >FUND A LOAN</b-button>
            <b-button data-cy="borrow-button" size="lg" variant="primary" @click="goBorrow">BORROW</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-jumbotron>
  </b-container>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('api/funding')
    let funded = await $axios.get('api/funded')
    return {
      funding: funding.data,
      funded: funded.data
    }
  },
  components: {
    Logo
  },
  data() {
    return {
      key: 'value'
    }
  },
  methods: {
    goFunding() {
      this.$router.push({ path: '/funding' })
    },
    goBorrow() {
      this.$router.push({ path: '/borrow' })
    }
  }
}
</script>

<style>
.invest-action-buttons {
  margin-top: 4em;
}
</style>
