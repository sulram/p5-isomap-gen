const R = require('ramda')
//const p5 = require('p5')

const {generateMap, getCoastEdges} = require('./map')
const {isoFrom2D, isoFrom2DArray} = require('./isometric')

const mapIndexed = R.addIndex(R.map)
const makeRect = (x,y,w,h) => {
    return [
        {x,y},
        {x: x+w, y},
        {x: x+w, y: y+h},
        {x, y: y+h}
    ]
}

const sketch = (p) => {

    let map, maplast

    p.setup = () => {
        
        p.createCanvas(p.windowWidth, p.windowHeight)
        // p.createCanvas(512, 512)
        p.background(0)

        p.angleMode(p.DEGREES)
        p.ellipseMode(p.CENTER)
        p.textSize(8)

        map = generateMap(256,256)

    }

    p.drawIsoPath = path => {
        newPath = isoFrom2DArray(path)
        p.beginShape()
            R.map(pt => p.vertex(pt.x,pt.y), newPath)
        p.endShape(p.CLOSE)
    }

    p.draw = () => {

        p.background(0)
        
        const coastEdges = getCoastEdges(map.edges)

        // DEBUG

            // poly
            p.noStroke()
            p.fill(100)
            mapIndexed( (poly,idx) => {
                // p.text(idx,poly.point.x,poly.point.y+10)
                p.ellipse(poly.point.x,poly.point.y,3,3)
            }, map.centers)

            // edges
            p.noFill()
            p.stroke(100)

            R.map(edge => {
                const a = edge.v0.point
                const b = edge.v1.point
                p.line(a.x,a.y,b.x,b.y)
                if(edge.midpoint){
                    p.text(edge.index,edge.midpoint.x,edge.midpoint.y)
                }
            }, coastEdges)

        // ISOMETRIC

            p.push()
            p.translate(p.windowWidth*0.5-0,p.windowHeight*0.5-128)

                p.stroke(255)

                mapIndexed((edge,idx) => {
                    const a = isoFrom2D(edge.v0.point)
                    const b = isoFrom2D(edge.v1.point)
                    p.line(a.x,a.y,b.x,b.y)
                }, coastEdges)

                const rect = makeRect(32,32,256-32,256-32)

                // p.translate(0,-64)
                // p.drawIsoPath(rect)

                // p.translate(0,-64)
                // p.drawIsoPath(rect)


            p.pop()


    }

    p.windowResized = () => {
        
        p.resizeCanvas(p.windowWidth, p.windowHeight);

    }

    p.touchStarted = () => {

    }

    p.touchEnded = () => {

        maplast = map
        map = generateMap(256,256)

        console.log(map)

    }

}

new p5(sketch)