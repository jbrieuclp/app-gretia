import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import WMTS from 'ol/source/WMTS';
import TileWMS from 'ol/source/TileWMS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import * as proj from 'ol/proj';
import * as extent from 'ol/extent';
import * as format from 'ol/format';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';

const attributionIGN = {html: '<a href="http://www.ign.fr/" target="_blank"><img src="/carte/bundles/visuconsultation/carto/images/logos/wh80px/ign.png"></a>'
+ '<a href="http://www.geoportail.fr/" target="_blank"><img src="http://api.ign.fr/geoportail/api/js/2.0.0beta/theme/geoportal/img/logo_gp.gif"></a>'
+ '<a href="http://www.geoportail.gouv.fr/depot/api/cgu/licAPI_CGUF.pdf" alt="TOS" title="TOS" target="_blank">Conditions</a>'
};

const epsg3857 = proj.get('EPSG:3857');
const keyIGN = 'zbmh0bqkgl1a6yfhdj6myh5k';
const resolutions = [156543.03392804097,78271.51696402048,39135.75848201024,19567.87924100512,9783.93962050256,4891.96981025128,2445.98490512564,1222.99245256282,611.49622628141,305.748113140705,152.8740565703525,76.43702828517625,38.21851414258813,19.109257071294063,9.554628535647032,4.777314267823516,2.388657133911758,1.194328566955879,0.5971642834779395,0.29858214173896974,0.14929107086948487,0.07464553543474244];
const matrixIds = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];

export const layers = [
	new LayerGroup({
			title: 'Fonds de plan',
            id: 'g_fdp',
			displayInLayerSwitcher: true,
			layers: [
                new TileLayer({
                    title: 'OpenTopoMap - cartes',
                    id: 'l_osm_carte',
                    visible: true,
                    'displayInLayerSwitcher' : true,
                    opacity: 0.4,
                    type: 'base',
                    source: new XYZ({
                        url: '//{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
                    })
                }),
                new TileLayer({
                    opacity: 1,
                    title: 'IGN - vue aérienne',
                    id: 'l_ign_ortho',
                    visible: false,
                    'displayInLayerSwitcher' : true,
                    extent: epsg3857.getExtent(),
                    source: new WMTS({
                        attributions: [attributionIGN],
                        url: `https://wxs.ign.fr/decouverte/geoportail/wmts`,
                        layer: 'ORTHOIMAGERY.ORTHOPHOTOS',
                        matrixSet: 'PM',
                        format: 'image/jpeg',
                        name: "IGN - cartes",
                        style: "normal",
                        numZoomLevels: 19,
                        group : 'IGN',
                        territory:'FXX',
                        projection: epsg3857,
                        tileGrid: new WMTSTileGrid({
                            origin: extent.getTopLeft(epsg3857.getExtent()),
                            resolutions: resolutions,
                            matrixIds: matrixIds
                        })
                    })
                }),
                new TileLayer({
                    opacity: 0.3,
                    title: 'IGN - cartes',
                    id: 'l_ign_carte',
                    visible: false,
                    'displayInLayerSwitcher' : true,
                    extent: epsg3857.getExtent(),
                    source: new WMTS({
                        attributions: [attributionIGN],
                        url: `https://wxs.ign.fr/${keyIGN}/geoportail/wmts`,
                        layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
                        matrixSet: 'PM',
                        format: 'image/jpeg',
                        name: "IGN - cartes",
                        style: "normal",
                        numZoomLevels: 19,
                        group : 'IGN',
                        territory:'FXX',
                        projection: epsg3857,
                        tileGrid: new WMTSTileGrid({
                            origin: extent.getTopLeft(epsg3857.getExtent()),
                            resolutions: resolutions,
                            matrixIds: matrixIds
                        })
                    })
                }),
                new VectorLayer({
                    opacity: 0.9,
                    title: 'Limite Massif armoricain', 
                    id: 'l_limite_ma',
                    visible: true,
                    'displayInLayerSwitcher' : true,
                    source:  new VectorSource({
                        format:  new format.GeoJSON({projection: epsg3857}),
                        url: 'assets/carto/limite_ma.geojson' 
                    }),
                    style: function(feature, resolution) {
                        return new Style({
                            stroke: new Stroke({
                                color: '#cc0a00',
                                width: 2,
                                lineDash: [5],
                                lineDashOffset: 4
                            })
                        });
                    }
                }),
                new TileLayer({
                    opacity: 0.8,
                    title: 'Géologie',
                    id: 'l_geologie',
                    visible: false,
                    'displayInLayerSwitcher' : true,
                    source: new TileWMS({
                        attributions: [{
                            html: '&copy; ' +
                            '<div><a href="http://www.brgm.fr/" target="_blank">BRGM</a></div>'
                            }],
                        crossOrigin: null,
                        params: {
                            'LAYERS': 'GEOLOGIE',
                            'FORMAT': 'image/png',
                            'TRANSPARENT' : 'TRUE',
                            'PROJECTION':'EPSG:3857'
                        },
                        url: 'http://geoservices.brgm.fr/geologie?',
                        serverType: 'mapserver'
                    })
                })
            ]
	}),
    new LayerGroup({
        title: 'Zonages',
        id: 'g_zonages',
        displayInLayerSwitcher: true,
        layers: [
            new TileLayer({
                opacity: 1,
                title: 'Parcs Naturels Régionaux',
                visible: false,
                'displayInLayerSwitcher' : true,
                'order': 0,
                extent: epsg3857.getExtent(),
                source: new WMTS({
                    attributions: [attributionIGN],
                    url: `https://wxs.ign.fr/environnement/geoportail/r/wms`,
                    layer: 'PROTECTEDAREAS.PNR',
                    matrixSet: 'PM',
                    format: 'image/png',
                    name: "IGN - Parcs Naturels Régionaux",
                    style: "normal",
                    numZoomLevels: 19,
                    group : 'IGN',
                    territory:'FXX',
                    projection: epsg3857,
                    tileGrid: new WMTSTileGrid({
                        origin: extent.getTopLeft(epsg3857.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            }),
            new TileLayer({
                opacity: 1,
                title: 'Parcs Naturels Marins',
                visible: false,
                'displayInLayerSwitcher' : true,
                'order': 1,
                extent: epsg3857.getExtent(),
                source: new WMTS({
                    attributions: [attributionIGN],
                    url: `https://wxs.ign.fr/environnement/geoportail/r/wms`,
                    layer: 'PROTECTEDAREAS.PNM',
                    matrixSet: 'PM',
                    format: 'image/png',
                    name: "IGN - Parcs Naturels Marins",
                    style: "normal",
                    numZoomLevels: 19,
                    group : 'IGN',
                    territory:'FXX',
                    projection: epsg3857,
                    tileGrid: new WMTSTileGrid({
                        origin: extent.getTopLeft(epsg3857.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            }),
            new TileLayer({
                opacity: 1,
                title: 'Réserves Naturelles Nationales',
                visible: false,
                'displayInLayerSwitcher' : true,
                'order': 2,
                extent: epsg3857.getExtent(),
                source: new WMTS({
                    attributions: [attributionIGN],
                    url: `https://wxs.ign.fr/environnement/geoportail/r/wms`,
                    layer: 'PROTECTEDAREAS.RN',
                    matrixSet: 'PM',
                    format: 'image/png',
                    name: "IGN - Réserves Naturelles Nationales",
                    style: "normal",
                    numZoomLevels: 19,
                    group : 'IGN',
                    territory:'FXX',
                    projection: epsg3857,
                    tileGrid: new WMTSTileGrid({
                        origin: extent.getTopLeft(epsg3857.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            }),
            new TileLayer({
                opacity: 1,
                title: 'Réserves Biologiques',
                visible: false,
                'displayInLayerSwitcher' : true,
                'order': 3,
                extent: epsg3857.getExtent(),
                source: new WMTS({
                    attributions: [attributionIGN],
                    url: `https://wxs.ign.fr/environnement/geoportail/r/wms`,
                    layer: 'PROTECTEDAREAS.RB',
                    matrixSet: 'PM',
                    format: 'image/png',
                    name: "IGN - Réserves Biologiques",
                    style: "normal",
                    numZoomLevels: 19,
                    group : 'IGN',
                    territory:'FXX',
                    projection: epsg3857,
                    tileGrid: new WMTSTileGrid({
                        origin: extent.getTopLeft(epsg3857.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            }),
            new TileLayer({
                opacity: 1,
                title: 'Sites Natura 2000 (Directive Habitats)',
                visible: false,
                'displayInLayerSwitcher' : true,
                'order': 4,
                extent: epsg3857.getExtent(),
                source: new WMTS({
                    attributions: [attributionIGN],
                    url: `https://wxs.ign.fr/environnement/geoportail/r/wms`,
                    layer: 'PROTECTEDAREAS.SIC',
                    matrixSet: 'PM',
                    format: 'image/png',
                    name: "IGN - Sites Natura 2000 (Directive Habitats)",
                    style: "normal",
                    numZoomLevels: 19,
                    group : 'IGN',
                    territory:'FXX',
                    projection: epsg3857,
                    tileGrid: new WMTSTileGrid({
                        origin: extent.getTopLeft(epsg3857.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            }),
            new TileLayer({
                opacity: 1,
                title: 'Sites Natura 2000 (Directive Oiseaux)',
                visible: false,
                'displayInLayerSwitcher' : true,
                'order': 5,
                extent: epsg3857.getExtent(),
                source: new WMTS({
                    attributions: [attributionIGN],
                    url: `https://wxs.ign.fr/environnement/geoportail/r/wms`,
                    layer: 'PROTECTEDAREAS.ZPS',
                    matrixSet: 'PM',
                    format: 'image/png',
                    name: "IGN - Sites Natura 2000 (Directive Oiseaux)",
                    style: "normal",
                    numZoomLevels: 19,
                    group : 'IGN',
                    territory:'FXX',
                    projection: epsg3857,
                    tileGrid: new WMTSTileGrid({
                        origin: extent.getTopLeft(epsg3857.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            }),
            new TileLayer({
                opacity: 1,
                title: 'ZNIEFF Type 1',
                visible: false,
                'displayInLayerSwitcher' : true,
                'order': 6,
                extent: epsg3857.getExtent(),
                source: new WMTS({
                    attributions: [attributionIGN],
                    url: `https://wxs.ign.fr/environnement/geoportail/r/wms`,
                    layer: 'PROTECTEDAREAS.ZNIEFF1',
                    matrixSet: 'PM',
                    format: 'image/png',
                    name: "IGN - ZNIEFF Type 1",
                    style: "normal",
                    numZoomLevels: 19,
                    group : 'IGN',
                    territory:'FXX',
                    projection: epsg3857,
                    tileGrid: new WMTSTileGrid({
                        origin: extent.getTopLeft(epsg3857.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            }),
            new TileLayer({
                opacity: 1,
                title: 'ZNIEFF Type 2',
                visible: false,
                'displayInLayerSwitcher' : true,
                'order': 7,
                extent: epsg3857.getExtent(),
                source: new WMTS({
                    attributions: [attributionIGN],
                    url: `https://wxs.ign.fr/environnement/geoportail/r/wms`,
                    layer: 'PROTECTEDAREAS.ZNIEFF2',
                    matrixSet: 'PM',
                    format: 'image/png',
                    name: "IGN - ZNIEFF Type 2",
                    style: "normal",
                    numZoomLevels: 19,
                    group : 'IGN',
                    territory:'FXX',
                    projection: epsg3857,
                    tileGrid: new WMTSTileGrid({
                        origin: extent.getTopLeft(epsg3857.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            }),
            new TileLayer({
                opacity: 1,
                title: 'Zones humides d\'importance internationale (RAMSAR)',
                visible: false,
                'displayInLayerSwitcher' : true,
                'order': 8,
                extent: epsg3857.getExtent(),
                source: new WMTS({
                    attributions: [attributionIGN],
                    url: `https://wxs.ign.fr/environnement/geoportail/r/wms`,
                    layer: 'PROTECTEDAREAS.RAMSAR',
                    matrixSet: 'PM',
                    format: 'image/png',
                    name: "IGN - RAMSAR",
                    style: "normal",
                    numZoomLevels: 19,
                    group : 'IGN',
                    territory:'FXX',
                    projection: epsg3857,
                    tileGrid: new WMTSTileGrid({
                        origin: extent.getTopLeft(epsg3857.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            })
        ]
    })
];