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

module.exports = {
    isoTo2D,
    isoFrom2D
}