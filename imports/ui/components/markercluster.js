import React from 'react';
import { MapLayer } from 'react-leaflet';

class MarkerCluster extends MapLayer {
    componentWillMount() {
        this.leafletElement = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false
        });
    }

    componentWillReceiveProps(nextProps) {
        var markers = [];

        console.log(nextProps.parkingMetadata);
        _.forEach(nextProps.parkingMetadata, (val)=>{
            var marker = L.marker(new L.LatLng(val.Latitude, val.Longitude), { title: "1" })
            markers.push(marker);
        });

        if (markers.length>0)
            this.leafletElement.addLayers(markers);
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