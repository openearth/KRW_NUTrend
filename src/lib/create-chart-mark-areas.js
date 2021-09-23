export default ({ color, name, min, max }) => {
  return {
    type: 'line',
    markArea: {
      silent: true,
      itemStyle: {
        color,
      },
      label: {
        position: [ '101%', '45%' ],
        align: 'left',
      },
      data: [
        [
          {
            name,
            yAxis: min,
          },
          {
            yAxis: max,
          },
        ],
      ],
    },
  }
}
