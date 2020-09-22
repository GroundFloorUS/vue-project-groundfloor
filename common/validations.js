const addressRegex = new RegExp(
  /([0-9]+)\s([A-Za-z0-9\-\s]+)\,?\s([A-Za-z\s]+)\,\s([A-Z]{2})\s([0-9\-]{5,10})/,
  'i'
)

const validateAddress = address => addressRegex.test(address)

const validateRate = rate => {
  // TODO make this rate a configuration in a datastore.
  const minRate = 5
  return rate >= minRate
}

const validateLoanAmount = loanAmount => {
  // TODO make the loadAmount a configuration in a datastore.
  const minLoadAmount = 50000
  // MONEY IN DOLLARS (no CENTS)
  return loanAmount >= minLoadAmount
}

// NOT IN THE REQUIREMENTS BUT MADE IT UP TO ENSURE TEHRE IS SOME VALIDATION
const validateFundingAmount = fundingAmount => {
  const minFundingAmount = 5000
  return fundingAmount >= minFundingAmount
}

module.exports = {
  validateAddress,
  validateRate,
  validateLoanAmount,
  validateFundingAmount
}
