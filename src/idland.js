const R = require('ramda')
//const p5 = require('p5')

const {generateMap, subdivide} = require('./map')
const f5 = require('./f5')
const gui = new dat.GUI()

let map, maplast

let data = {
    mapDebug: false,
    mapDots: true,
    mapPoints: 64,
    lineAlpha: 64,
    dotsDensity: 7,
    rotationSpeed: 5,
    wave: 1,
    waveMult: 1,
    animationSpeed: 30,
    dotSize: 4,
    dotY: 16,
    generateMap: () => {
        maplast = map
        map = generateMap(256, 256, data.mapPoints, data.dotsDensity)
    }
}

var f1 = gui.addFolder('Map Layer');
f1.add(data, 'rotationSpeed', -100, 100)
f1.add(data, 'animationSpeed', -256, 256)
f1.add(data, 'wave', 0, 8, 1)
f1.add(data, 'waveMult', 1, 16, 1)
f1.add(data, 'dotSize', 0, 16)
f1.add(data, 'dotY', 0, 64)
f1.add(data, 'lineAlpha', 0, 255)
f1.add(data, 'mapDots')
f1.add(data, 'mapDebug')
f1.add(data, 'mapPoints', 16, 128, 16)
f1.add(data, 'dotsDensity', 1, 16).onChange(()=>{
    map = {...map, coastVertices: subdivide(map.coastPoints, data.dotsDensity)}
})
f1.add(data, 'generateMap')
f1.open()

const sketch = (p) => {
    
    let myFont
    let thetaRot = 0
    let thetaAni = 0

    let n = 0

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

        // DEBUG
        if(data.mapDebug){

            // poly
            p.noStroke()
            p.fill(100)
            R.map(poly => {
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

                const f = f5.rotPA([128,128],thetaRot)
                const size = data.dotSize
                const freq = data.wave * data.waveMult

                R.map(path => {
                    
                    const convertedPath = R.map(v=>f(v.point), path)

                    p.stroke(data.lineAlpha)
                    p.noFill()
                    p.drawIsoPath(convertedPath)
                    p.translate(0, -data.dotY)

                    if(data.mapDots){
                        
                        p.fill(255)
                        p.noStroke()
                        
                        f5.mapIndexed((v,idx) => {
                            const a = p.radians(idx * 360 / path.length * freq)
                            const dotSize = size + size * p.sin(a + thetaAni)
                            p.ellipse(v.x,v.y, dotSize, dotSize * 0.5)
                        }, f5.isoFrom2DArray(convertedPath))
                    }

                    p.translate(0, data.dotY)

                }, map.coastVertices)                

            p.pop()

        thetaRot += data.rotationSpeed * 0.001
        thetaAni += data.animationSpeed * 0.001

        //console.log(n, map.coastPoints[0].length-3, map.coastPoints[0][n])
    }

    p.windowResized = () => {
        
        p.resizeCanvas(p.windowWidth, p.windowHeight);

    }

    p.touchStarted = () => {

    }

    p.touchEnded = () => {

        // console.log(map)

    }

}

new p5(sketch)