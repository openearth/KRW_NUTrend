import checkForNull from './toestand-graphs-utils/check-for-null'

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
      return [ event.date, checkForNull(event.value) ]
    })
  
  return {
    location,
    data: events,
  }
}
