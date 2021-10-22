/**
 * Input is the labels
 * 

*/

export default((labels, serie) =>{

  let data = []
  labels.forEach(element => {
    
    const serieObject = serie.find(({ label }) => label === element)
 
    serieObject ? data.push(parseFloat(serieObject.value)) : data.push(null)
    
    
  })
  
  return data
})