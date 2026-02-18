import checkForNull from './toestand-graphs-utils/check-for-null'

export default (data, type) => {
  console.log('data', data)
  if (!data?.timeSeries || !data.timeSeries.length) {
    return []
  }

  const location = data.timeSeries
    .map(({ header }) => header)
    .reduce((obj, item) => item, {})

    let dateValuePairs = []

    try {
      dateValuePairs = data.timeSeries
        .map(({ events }) => events)
        .flat()
        .map(event => [ event.date, checkForNull(event.value) ])
    } catch (error) {
      dateValuePairs = []
    }
  
    return {
      location,
      data: dateValuePairs,
    }
}
