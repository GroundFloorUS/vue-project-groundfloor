<template>
  <b-container>
    <b-jumbotron
      header="Borrow"
      lead="Begin your loan journey here"
      bg-variant="info"
      text-variant="light"
    />

    <b-form
      novalidate
      @submit="onSubmit"
    >
      <b-form-group
        :validated="isSubmitted"
        label="Purpose"
        label-for="purpose"
      >
        <b-form-select id="purpose"
                       v-model="purpose.value"
                       :options="purpose.options"
                       name="purpose"/>
      </b-form-group>

      <b-form-group
        :validated="isSubmitted"
        :state="isAddressValid"
        :invalid-feedback="addressInvalidFeedback"
        label="Address"
        label-for="address"
      >
        <b-form-input
          id="address"
          :state="isAddressValid"
          v-model="address"
          type="text"
          name="address"
          required
        />
      </b-form-group>

      <b-form-group
        :validated="isSubmitted"
        :state="isRateValid"
        :invalid-feedback="rateInvalidFeedback"
        label="Rate"
        label-for="rate"
      >
        <b-input-group>
          <b-form-input id="rate"
                        v-model="rate"
                        min="0"
                        max="20"
                        type="number"
                        name="rate"/>
          <b-input-group-append>
            <span class="input-group-text">%</span>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-form-group
        :validated="isSubmitted"
        label="Expected Term"
        label-for="expected_term_months"
      >
        <b-input-group>
          <b-form-input id="expected_term_months"
                        v-model="expected_term_months"
                        type="number"
                        name="expected_term_months"/>
          <b-input-group-append>
            <span class="input-group-text">months</span>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-form-group
        :state="isAmountValid"
        :validated="isSubmitted"
        :invalid-feedback="amountInvalidFeedback"
        label="LoanAmount"
        label-for="loan_amount_dollars">
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input id="loan_amount_dollars"
                        v-model="loan_amount_dollars"
                        min="50000"
                        step="1000"
                        type="number"
                        name="loan_amount_dollars"/>
        </b-input-group>
      </b-form-group>

      <b-button type="submit" variant="success">Let's Do This!</b-button>

    </b-form>

  </b-container>
</template>

<script src="./borrow.js"/>
