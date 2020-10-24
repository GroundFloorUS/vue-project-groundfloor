<template>
  <div>
    <div v-if="!investments.length" class="empty-state">
      <slot name="empty-title">
        <h4>
          On no!
        </h4>
      </slot>
      <slot name="empty-text">
        <p>
          There aren't any loan requests to fund. Check back again soon!
        </p>
      </slot>
    </div>

    <ul v-if="investments.length" class="loan-list">
      <li v-for="investment in investments" :key="investment.id">
        <nuxt-link :to="'/investment/' + investment.id">
          <slot :investment="investment" name="component"/>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    investments: { type: Array, required: true }
  }
}
</script>

<style>
.empty-state {
  margin: 1rem 0;
  padding: 3rem;
  text-align: center;
  background: whitesmoke;
  border: 1px solid lightgray;
  border-radius: 3px;
}
.loan-list {
  margin: 1rem 0;
  padding: 0;
  list-style: none;
}
li {
  margin: 0;
  padding: 0;
}
li a {
  color: inherit;
  text-decoration: none !important;
}
li a:hover .loan-card {
  background: white;
}
li a:hover h3.loan-card__title {
  color: #40a6cc !important;
}
</style>
