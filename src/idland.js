const R = require('ramda')
//const p5 = require('p5')

const {generateMap} = require('./map')
const f5 = require('./f5')

const mapIndexed = R.addIndex(R.map)


const gui = new dat.GUI()

let map, maplast

let data = {
    mapDebug: false,
    mapPoints: 64,
    rotationSpeed: 5,
    generateMap: () => {
        maplast = map
        map = generateMap(256,256,data.mapPoints)
    }
}

var f1 = gui.addFolder('Map Layer');
f1.add(data, 'mapPoints', 16, 128, 16)
f1.add(data, 'rotationSpeed', -100, 100)
f1.add(data, 'mapDebug')
f1.add(data, 'generateMap')
f1.open()


const sketch = (p) => {

    
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
        

        data.generateMap()

    }

    p.drawIsoPath = (path, curved) => {
        newPath = f5.isoFrom2DArray(path)
        p.beginShape()
            R.map(pt => curved
                ? p.curveVertex(pt.x,pt.y)
                : p.vertex(pt.x,pt.y),
            newPath)
        p.endShape(p.CLOSE)
    }

    p.draw = () => {

        p.background(0)

        if(data.mapDebug){
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
            }, map.coastEdges)
        }

        // ISOMETRIC

            p.push()
            p.translate(p.windowWidth*0.5-0,p.windowHeight*0.5-128)

                p.noFill()
                p.stroke(255)

                // const rect = f5.makeRect(0,0,256,256)
                // p.drawIsoPath(rect)

                const f = f5.rotPA([128,128],theta)

                mapIndexed((path,idx) => {
                    p.stroke(255-idx*50)
                    const convertedPath = R.map(v=>f(v.point), path)
                    p.drawIsoPath(convertedPath)
                }, map.coastPoints)

            p.pop()

        theta += data.rotationSpeed * 0.001
    }

    p.windowResized = () => {
        
        p.resizeCanvas(p.windowWidth, p.windowHeight);

    }

    p.touchStarted = () => {

    }

    p.touchEnded = () => {

        

        console.log(map)

    }

}

new p5(sketch)