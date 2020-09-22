const asCurrency = num => {
  const str = num.toString()
  return `$${str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

module.exports = {
  asCurrency
}
