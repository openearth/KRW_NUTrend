import buildCirclesColor from './build-circles-color'
//Semicircle right is the new value
//Semicircle left is the old value
//Passing to buildCircleColor the left means I want the value2
export default ({ id, data }, semicircle, legend) => {
  
  return {
    id: `${ id }-${ semicircle }`,
    type: 'symbol',
    source: {
      type: 'geojson',
      data,
    },
    layout: {
      'text-field': semicircle === 'right'? '◗' : '◖',
                'text-font': [ 'DIN Pro Medium', 'Arial Unicode MS Regular' ],
                'text-size': 25,
                'text-padding': 0,
                'text-justify': 'auto',
                'text-radial-offset': [
                    'interpolate',
                    [ 'linear' ],
                    [ 'zoom' ],
                    1,
                    0.05,
                    5,
                    0.0625,
                    10,
                    0.088,
                    22,
                    0.1,
                ],
                'text-allow-overlap': true,
                'text-variable-anchor': [ 'center' ],
            },
    paint: {
            'text-color': semicircle === 'right'? buildCirclesColor(legend) : buildCirclesColor(legend, 'value2'),
            'text-halo-color': 'hsla(0, 0%, 0%, 0)',
            'text-halo-width': 1.25,
            'text-halo-blur': 0.5,
    },
  }
}
