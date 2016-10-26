import React from 'react';
import { MapLayer } from 'react-leaflet';

require('./leaflet-text-icon.js');

class MarkerCluster extends MapLayer {
    constructor(props) {
        super(props);

        this._parkingMetadata = [];
    }

    componentWillMount() {
        var markers = [];

        this.leafletElement = L.markerClusterGroup();

        if (!this._parkingMetadata.length && this.props.parkingMetadata.length) {
            
            this._parkingMetadata = this.props.parkingMetadata.slice(0);

            _.forEach(this._parkingMetadata, (val) => {
                var marker = L.marker(new L.LatLng(val.Latitude, val.Longitude), {
                    title: val.Street,
                    icon: new L.TextIcon({
                        text: '12',
                        color: 'red'
                    })
                });
                marker.bindPopup(
                    "<b>Street name: </b>"+val.Street+"<br>"+
                    "<b>Bay type: </b>"+val.BayType+"<br>"+
                    "<b>Tarrif code:</b>"+val.TariffCode+"<br>"+
                    "<b>Bay count:</b>"+val.BayCount);
                markers.push(marker);
            });

            this.leafletElement.addLayers(markers);
        }
    }

    componentWillReceiveProps(nextProps) {
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