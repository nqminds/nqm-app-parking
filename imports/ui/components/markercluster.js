import React from 'react';
import { MapLayer } from 'react-leaflet';

require('./leaflet-text-icon.js');

class MarkerCluster extends MapLayer {
    constructor(props) {
        super(props);

        this._parkingMetadata = [];
        this._markers = {};
    }

    componentWillMount() {
        var markers = [];

        this.leafletElement = L.markerClusterGroup();
        
        if (!this._parkingMetadata.length && this.props.parkingMetadata.length) {
            
            this._parkingMetadata = this.props.parkingMetadata.slice(0);

            _.forEach(this._parkingMetadata, (val) => {

                this._markers[Number(val.LotCode)] = L.marker(new L.LatLng(val.Latitude, val.Longitude), {
                    title: val.Street,
                    icon: new L.TextIcon({
                        text: val.BayCount,
                        color: 'blue',
                        id: Number(val.LotCode)
                    })
                });
                this._markers[Number(val.LotCode)].bindPopup(
                    "<b>Street name: </b>"+val.Street+"<br>"+
                    "<b>Bay type: </b>"+val.BayType+"<br>"+
                    "<b>Tarrif code:</b>"+val.TariffCode+"<br>"+
                    "<b>Bay count:</b>"+val.BayCount).on('click', (e) => console.log(e.target.options.icon.options.id));
                markers.push(this._markers[Number(val.LotCode)]);
            });

            this.leafletElement.addLayers(markers);
        }
    }

    componentWillReceiveProps(nextProps) {
        _.forEach(nextProps.data, (val)=>{
            let color = Number(val.currentvalue)?'blue':'red';
            this._markers[Number(val.ID)].options.icon.options.color = color;
            this._markers[Number(val.ID)].options.icon.options.text = '0';//val.currentvalue;    
        });
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