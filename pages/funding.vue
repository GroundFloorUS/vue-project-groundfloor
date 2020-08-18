<template>
  <b-container>
    <b-jumbotron
      header="Funding"
      lead="Entrepreneurs helping entrepreneurs"
      bg-variant="info"
      text-variant="light"
    />

    <ul class="funding-list">
      <li v-for="investment in funding" :key="investment.id">
        <p>
          <nuxt-link :to="'/investment/' + investment.id">
            {{ investment.address }}
          </nuxt-link>
        </p>
        <p>
          {{ investment.loan_amount_dollars }}
        </p>
      </li>
    </ul>
  </b-container>
</template>

<script>
export default {
  // The way this was written before would not have properly handled an api error
  async asyncData({ $axios }) {
    return new Promise((resolve,reject) => {
      $axios.get('/api/funding')
      .then((response) => {
        if (response && response.data) {
          resolve({
            funding: response.data
          })
        } else {
          console.error('Invalid response!', response);
          reject(new Error('Invalid response'));
        }
      })
      .catch(reject);
    });
  }
}
</script>
