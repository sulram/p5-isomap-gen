const R = require('ramda')

const islandShape = require('voronoi-map/src/island-shape');
const mapModule = require('voronoi-map/src/map');
const pointSelectorModule = require('voronoi-map/src/point-selector');

const generateMap = (width, height) => {

    const map = mapModule({width, height});
    map.newIsland(islandShape.makeRadial(1+Math.random()*999), 1);
    map.go0PlacePoints(100, pointSelectorModule.generateRandom(width, height, map.mapRandom.seed));
    map.go1BuildGraph();
    map.assignBiomes();
    map.go2AssignElevations();
    map.go3AssignMoisture();
    map.go4DecorateMap();

    const {centers, corners, edges} = map

    // console.log(map, map.mapRandom.seed)

    return {
        centers,
        corners,
        edges
    }
}



const filterCoastEdges = (edges) => {
    return R.filter(e => e.v0 && e.v1 && e.v0.coast && e.v1.coast, edges)
}

const getCoastEdges = (edges) => {
    return R.map(e => { return {'v0': e.v0.point, 'v1': e.v1.point}}, filterCoastEdges(edges))
}

module.exports = {
    generateMap,
    getCoastEdges
}
