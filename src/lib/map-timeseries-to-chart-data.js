export default (data, type) => {
  if (!data?.timeSeries.length) {
    return []
  }

  const location = data.timeSeries
    .map(({ header }) => header)
    .reduce((obj, item) => item, {})

  const events = data.timeSeries
    .map(({ events }) => events)
    .flat()
    .map(event => {
      return {
        label: type==='scatter' ? event.date : event.date.split('-')[0],
        value: event.value,
      }
    })

  return {
    location,
    data: events,
  }
}
