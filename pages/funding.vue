<template>
  <b-container>
    <b-jumbotron
      header="Funding"
      lead="Entrepreneurs helping entrepreneurs. Or Bill Murray."
      bg-variant="info"
      text-variant="light"
    />

    <div class="investments">
      <div
        v-for="(investment, investmentIndex) in funding"
        :key="investment.id"
        class="investment"
      >
        <murray-media
          :seed="investmentIndex"
          class="investment__media"
        />
        <div class="investment__body">
          <div class="investment__title">{{ investment.address }}</div>
          <div class="investment__details">
            <strong>${{ investment.loan_amount_dollars }}</strong> - {{ investment.rate }}% over {{ investment.expected_term_months }} months.
          </div>
          <div class="investment__actions">
            <nuxt-link
              :to="`/investment/${investment.id}`"
              class="btn btn-primary btn-lg"
            >
              <strong>Learn More!</strong>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

  </b-container>
</template>

<style lang="scss">
  .investments {
    max-width:800px;
    margin:0 auto;
  }

  .investment {
    display: flex;
    flex-direction: row;

    & + & {
      margin-top:3rem;
      padding-top:3rem;
      border-top:2px solid rgba(0,0,0,.2);
    }

    &__media {
      flex:0 0 300px;
      margin-right:2rem;

      img {
        width:100%;
        height:auto;
      }
    }

    &__body {
      flex:1 1 auto;
      display:flex;
      flex-direction: column;
      align-items: stretch;
    }

    &__details {
      flex:1 1 auto;
    }

    &__title {
      font-size:2.5em;
      line-height:1.45em;
      text-transform: capitalize;
    }

    &__actions {
      display:flex;
      flex-direction:row;
      align-items: center;
    }
  }
</style>

<script src="./funding.js"/>
