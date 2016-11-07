import React from 'react';
import { MapLayer } from 'react-leaflet';
import './leaflet-text-icon.js';

class MarkerCluster extends MapLayer {
    constructor(props) {
        super(props);

        this._markers = {};    
    }

    componentWillMount() {
        let markers = [];
        let self = this;
        this.leafletElement = L.markerClusterGroup();
        
        if (!_.isEmpty(this.props.parkingMetadata)) {
            markers = _.map(this.props.parkingMetadata, (val,key)=>{
                this._markers[Number(val.LotCode)] = L.marker(new L.LatLng(val.Latitude, val.Longitude), {
                    title: val.Street,
                    icon: new L.TextIcon({
                        text: val.BayCount.toString(),
                        color: 'blue',
                        id: Number(val.LotCode)
                    })
                });
                
                this._markers[Number(val.LotCode)].bindPopup(
                    "<b>Street name: </b>"+val.Street+"<br>"+
                    "<b>Bay type: </b>"+val.BayType+"<br>"+
                    "<b>Tarrif code:</b>"+val.TariffCode+"<br>"+
                    "<b>Bay count:</b>"+val.BayCount).on('click', (e) => {self.props.onClickMarker(e.target.options.icon.options.id)});
                return this._markers[Number(val.LotCode)];
            });

            this.leafletElement.addLayers(markers);
        }
    }

    componentWillReceiveProps(nextProps) {
        _.forEach(nextProps.realTimeData, (val)=>{
            let color = Number(val.currentvalue)?'blue':'red';
            this._markers[Number(val.ID)].options.icon.setColor(color);
            this._markers[Number(val.ID)].options.icon.setText(val.currentvalue.toString());    
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
    parkingMetadata: React.PropTypes.object.isRequired,
    realTimeData: React.PropTypes.array.isRequired,
    onClickMarker: React.PropTypes.func.isRequired
};

export default MarkerCluster;