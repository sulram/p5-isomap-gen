const R = require('ramda')
//const p5 = require('p5')

const {generateMap, getCoastEdges} = require('./map')
const {isoFrom2D} = require('./isometric')

const sketch = (p) => {

    let map, maplast

    p.setup = () => {
        
        p.createCanvas(p.windowWidth, p.windowHeight)
        // p.createCanvas(512, 512)
        p.background(0)

        p.angleMode(p.DEGREES)
        p.ellipseMode(p.CENTER)

        map = generateMap(256,256)

    }

    p.draw = () => {

        p.background(0)
        p.fill(255)

        p.stroke(100)

        const coastEdges = getCoastEdges(map.edges)
        R.map(edge => p.line(edge.v0.x,edge.v0.y,edge.v1.x,edge.v1.y), coastEdges)

        p.push()
        p.translate(p.windowWidth*0.5-0,p.windowHeight*0.5-128)

            p.stroke(255)

            R.map(edge => {
                const a = isoFrom2D(edge.v0)
                const b = isoFrom2D(edge.v1)
                p.line(a.x,a.y,b.x,b.y)
            }, coastEdges)

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