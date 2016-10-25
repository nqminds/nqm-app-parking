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