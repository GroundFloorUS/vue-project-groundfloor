import Vue from 'vue'

Vue.filter('formatDate', function(value) {
  if (!value) {
    return ''
  }

  let date = new Date(value)
  return date.toLocaleDateString()
})

Vue.filter('formatDollars', function(value) {
  if (!value) {
    return ''
  }
  let parts = value.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
})
