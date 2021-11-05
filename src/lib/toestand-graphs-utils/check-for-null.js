export default((value) => { 

  if (value === '-999.0' || value === -999) {
    return null
  }
  return parseInt(value)
})