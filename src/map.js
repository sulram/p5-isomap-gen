const R = require('ramda')

const islandShape = require('voronoi-map/src/island-shape');
const mapModule = require('voronoi-map/src/map');
const pointSelectorModule = require('voronoi-map/src/point-selector');

const generateMap = (width, height, random) => {
    const seed = 1 + Math.random() * 9999
    const map = mapModule({width, height});
    map.newIsland(islandShape.makeRadial(seed), 1);
    map.go0PlacePoints(128, pointSelectorModule.generateRandom(width, height, random ? seed : map.mapRandom.seed));
    map.go1BuildGraph();
    map.assignBiomes();
    map.go2AssignElevations();
    //map.go3AssignMoisture();
    //map.go4DecorateMap();

    const {centers, corners, edges} = map

    // console.log(map, map.mapRandom.seed)

    return {
        centers,
        corners,
        edges
    }
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
