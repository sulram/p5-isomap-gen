const R = require('ramda')
const vec = require('vec-la')
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

const vecToFlat = point => [point.x,point.y]
const vecFromFlat = point => ({x: point[0], y: point[1]})

const sketch = (p) => {

    let map, maplast
    let myFont

    let theta = 0

    p.preload = () => {
        myFont = p.loadFont('assets/input_mono_regular.ttf');
    }

    p.setup = () => {
        
        p.createCanvas(p.windowWidth, p.windowHeight)
        // p.createCanvas(512, 512)
        // p.pixelDensity(2.0)
        
        p.textFont(myFont)
        p.textStyle(p.NORMAL)
        p.textSize(6)

        p.background(0)

        // p.angleMode(p.DEGREES)
        p.ellipseMode(p.CENTER)
        

        map = generateMap(256,256)

    }

    p.drawIsoPath = path => {
        newPath = isoFrom2DArray(path)
        p.beginShape()
            R.map(pt => p.vertex(pt.x,pt.y), newPath)
        p.endShape(p.CLOSE)
    }

    p.drawIsoCurve = path => {
        newPath = isoFrom2DArray(path)
        p.beginShape()
            R.map(pt => p.curveVertex(pt.x,pt.y), newPath)
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
            }, map.coastEdges)

            p.noStroke()
            p.fill(100)

            R.map(edge => {
                const a = edge.v0.point
                const b = edge.v1.point
                p.text(edge.v0.index,edge.v0.point.x,edge.v0.point.y)
                p.text(edge.v1.index,edge.v1.point.x,edge.v1.point.y)
                // if(edge.midpoint){
                //     p.text(edge.index,edge.midpoint.x,edge.midpoint.y)
                // }
            }, map.coastEdges)

        // ISOMETRIC

            p.push()
            p.translate(p.windowWidth*0.5-0,p.windowHeight*0.5-128)

                p.noFill()

                const rot = R.partialRight(vec.rotatePointAround, [[128,128], theta])
                const f = R.pipe(vecToFlat, rot, vecFromFlat)

                mapIndexed((path,idx) => {
                    p.stroke(255-idx*50)
                    p.drawIsoPath(R.map(v=>f(v.point), path))
                }, map.coastPoints)
                
                const rect = makeRect(32,32,256-32,256-32)

                // p.translate(0,-64)
                // p.drawIsoPath(rect)

                // p.translate(0,-64)
                // p.drawIsoPath(rect)


            p.pop()

        theta += 0.005
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