<template>
  <b-container>
    <b-jumbotron>
      <h1 class="title">
        <logo/>
      </h1>
      <h3 class="subtitle">
        Sample interview project for GROUNDFLOOR
      </h3>

      <b-container class="invest-action-buttons">
        <b-row>
          <b-col>
            <b-button size="lg" variant="success" @click="goFunding">
              FUND A LOAN
            </b-button>
            <b-button size="lg" variant="primary" @click="goBorrow">
              BORROW
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-jumbotron>
  </b-container>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  filters: {},
  data() {
    return {
      key: 'value'
    }
  },
  async asyncData({ $axios }) {
    const funding = await $axios.get('api/funding').catch(error => {
      console.log(error)
    })

    const funded = await $axios.get('api/funded').catch(error => {
      console.log(error)
    })

    return {
      funding: funding.data,
      funded: funded.data
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

li {
  list-style-type: square;
}
</style>
