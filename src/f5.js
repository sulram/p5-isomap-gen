const R = require('ramda')
const vec = require('vec-la')

// isometric conversion

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

// vector conversion

const vecToFlat = point => [point.x,point.y]
const vecFromFlat = point => ({x: point[0], y: point[1]})

// vec-la shortcuts

const rotPA = (cp,rad) => R.pipe(vecToFlat, R.curry(vec.rotatePointAround)(R.__,cp,rad), vecFromFlat)

// common shapes

const makeRect = (x,y,w,h) => {
    return [
        {x,y},
        {x: x+w, y},
        {x: x+w, y: y+h},
        {x, y: y+h}
    ]
}

// exports

module.exports = {
    isoTo2D,
    isoFrom2D,
    isoFrom2DArray,
    vecToFlat,
    vecFromFlat,
    rotPA,
    makeRect
}