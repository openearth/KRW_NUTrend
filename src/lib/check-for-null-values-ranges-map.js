export default((value) => { 

  if (value === '-999.0' || value === -999.0) {
    return 'null'
  }
  return parseFloat(value)
})