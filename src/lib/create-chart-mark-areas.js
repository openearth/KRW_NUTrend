export default ({ color, name, min, max }) => {
  return {
    type: 'line',
    name,
    color: color,
    markArea: {
      silent: true,
      itemStyle: {
        color,
      },
      label: {
        show: false,
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
