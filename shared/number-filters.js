export const currencyFilter = function(amount) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  return `${formatter.format(amount)}`
}

export const rateFilter = function(rate) {
  return `${rate.toFixed(2)}%`
}

export const isFunded = function(isFunded) {
  return isFunded ? 'Yes' : 'No'
}
