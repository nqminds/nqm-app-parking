import React from 'react';
import { MapLayer } from 'react-leaflet';

class MarkerCluster extends MapLayer {
    constructor() {
        super();
        this.parkingMetadata = [];
    }

    componentWillMount() {
        this.leafletElement = L.markerClusterGroup();
    }

    componentWillReceiveProps(nextProps) {
        var markers = [];
        //https://github.com/Leaflet/Leaflet.markercluster
        //https://github.com/troutowicz/geoshare/blob/7f0c45d433a0d52d78e02da9a12b0d2156fcbedc/test/app/components/MarkerCluster.jsx
        //view-source:http://leaflet.github.io/Leaflet.markercluster/example/marker-clustering-realworld.388.html
        //https://github.com/Leaflet/Leaflet.markercluster#usage
        
        if (!this.parkingMetadata.length && nextProps.parkingMetadata.length) {
            
            console.log(nextProps.parkingMetadata);
            this.parkingMetadata = nextProps.parkingMetadata;

            _.forEach(nextProps.parkingMetadata, (val)=>{
                var marker = L.marker(new L.LatLng(val.Latitude, val.Longitude), { title: val.Street });
                marker.bindPopup(val.Street);
                markers.push(marker);
            });

            this.leafletElement.addLayers(markers);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return null;
    }
}


MarkerCluster.propTypes = {
    parkingMetadata: React.PropTypes.array.isRequired,
    data: React.PropTypes.array.isRequired
};

export default MarkerCluster;