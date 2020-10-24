import Vue from 'vue'
import dayjs from 'dayjs'

// https://github.com/miguelmota/commafy
// Note: if this were a production instance, I would handle non-number values and/or note the license from commafy.
// I've used this package several times as a dependency but recently stopped because there was a vulnerability in
// one of its dependencies and there have not been updates to the main package in several years.
Vue.filter('commafy', function commafy(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.filter('simpleDate', function(value) {
  return dayjs(value).format('MMMM D, YYYY')
})
