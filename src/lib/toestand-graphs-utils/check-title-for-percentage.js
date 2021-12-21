export default((title)=> {
  if (!title) {
    return null
  }
  return title.includes('%')
})