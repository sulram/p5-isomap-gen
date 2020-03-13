const R = require('ramda')

const islandShape = require('voronoi-map/src/island-shape');
const mapModule = require('voronoi-map/src/map');
const pointSelectorModule = require('voronoi-map/src/point-selector');

const generateMap = (width, height, random) => {

    const seed = 1 + Math.random() * 9999
    const map = mapModule({width, height});
    map.newIsland(islandShape.makeRadial(seed), 1);
    map.go0PlacePoints(96, pointSelectorModule.generateRandom(width, height, random ? seed : map.mapRandom.seed));
    map.go1BuildGraph();
    map.assignBiomes();
    map.go2AssignElevations();
    //map.go3AssignMoisture();
    //map.go4DecorateMap();

    const {centers, corners, edges} = map
    const coastEdges = getCoastEdges(map.edges)
    const coastPoints = reorderPath(R.map(edge => {
        return {index: edge.index, v0:edge.v0, v1:edge.v1}
    }, R.uniq(coastEdges)))


    return {
        centers,
        corners,
        edges,
        coastEdges,
        coastPoints
    }
}

const findNextEdge = (edge,edges) => {

    const {idx,a,b} = {idx: edge.index, a: edge.v0, b: edge.v1}

    const filterEdges = R.filter(edge => edge.index !== idx, edges)
    const filterEdge = R.find(edge => edge.v0.index === b.index || edge.v1.index === b.index, filterEdges)

    if(filterEdge){
        const nextEdge = filterEdge.v0.index == b.index ? filterEdge : {...filterEdge, v0: filterEdge.v1, v1: filterEdge.v0}
        const nextEdges = R.without([filterEdge],filterEdges)
        return {
            a, b, nextEdge, nextEdges
        }
    } else {
        if(filterEdges.length){
            return {
                a, b, nextEdge: filterEdges[0], nextEdges: R.without([filterEdges[0]],filterEdges), newPath: true
            }
        }
    }
}

const reorderPath = edges => {
    
    let a = edges[0].v0
    let b = edges[0].v1
    let nextEdge = edges[0]
    let nextEdges = edges

    let path_count = 0
    let points = []
    let path_idx = 0

    while(path_count < edges.length && nextEdges.length) {

        const calc = findNextEdge(nextEdge,nextEdges)
        
        if(!points[path_idx]){
            points[path_idx] = []
        }
        
        points[path_idx].push(calc.a)

        a = calc.a
        b = calc.b
        
        nextEdge = calc.nextEdge
        nextEdges = calc.nextEdges

        if(calc.newPath){
            path_idx++
            points[path_idx] = []
        }

        path_count++

        //console.log(path_count, nextEdge, nextEdges)

    }

    console.log(points)
    return points

}

const getCoastEdges = edges => R.filter(e => {
    const peninsula = e.d0.ocean!=null || e.d1.ocean!=null
    const ocean = e.d0.ocean && e.d1.ocean
    return e.v0 && e.v1 && e.v0.coast && e.v1.coast && peninsula && !ocean
}, edges)

module.exports = {
    generateMap,
    getCoastEdges
}
