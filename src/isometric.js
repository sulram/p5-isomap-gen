const R = require('ramda')

const isoTo2D = (pt) => {
    return {
        x: (2 * pt.y + pt.x) / 2,
        y: (2 * pt.y - pt.x) / 2
    }
}
  
const isoFrom2D = (pt) => {
    return {
        x: pt.x - pt.y,
        y: (pt.x + pt.y) / 2
    }
}

const isoFrom2DArray = (pts) => {
    return R.map(pt => isoFrom2D(pt), pts)
}

module.exports = {
    isoTo2D,
    isoFrom2D,
    isoFrom2DArray
}