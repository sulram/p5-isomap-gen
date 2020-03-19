const R = require('ramda')
//const p5 = require('p5')

const {generateMap} = require('./map')
const f5 = require('./f5')
const gui = new dat.GUI()

let map, maplast

let data = {
    mapDebug: false,
    mapDots: true,
    mapPoints: 64,
    dotsDensity: 4,
    rotationSpeed: 5,
    animationFrequency: 10,
    animationSpeed: 30,
    dotSize: 4,
    generateMap: () => {
        maplast = map
        map = generateMap(256, 256, data.mapPoints, data.dotsDensity)
    }
}

var f1 = gui.addFolder('Map Layer');
f1.add(data, 'rotationSpeed', -100, 100)
f1.add(data, 'animationSpeed', -100, 100)
f1.add(data, 'animationFrequency', 1, 128)
f1.add(data, 'dotSize', 0, 16)
f1.add(data, 'mapDots')
f1.add(data, 'mapDebug')
f1.add(data, 'mapPoints', 16, 128, 16)
f1.add(data, 'dotsDensity', 2, 10)
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

                R.map(path => {
                    
                    const convertedPath = R.map(v=>f(v.point), path)

                    if(!data.mapDots){
                        p.stroke(255)
                        p.noFill()
                        p.drawIsoPath(convertedPath)
                    } else {
                        
                        p.fill(255)
                        p.noStroke()
                        const s = data.dotSize
                        f5.mapIndexed((v,idx) => {
                            const a = idx/path.length * Math.floor(path.length * data.animationFrequency/1280* p.PI) 
                            const wave = p.sin(a+thetaAni)

                            p.ellipse(v.x,v.y, s+s*wave,(s+s*wave)*0.5)
                        }, f5.isoFrom2DArray(convertedPath))
                    }

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