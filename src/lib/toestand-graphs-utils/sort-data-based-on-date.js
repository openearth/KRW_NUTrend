export default ((array)=> {
  if (!array.length) {
    return []
  }

  array.sort((a,b)=>{
    const adate = new Date(((a.year).substring(0,10)))
    const bdate = new Date(((b.year).substring(0,10)))
    return bdate - adate
  })

  return array
})