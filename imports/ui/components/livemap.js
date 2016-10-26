import React from "react";
import ReactDOM from 'react-dom';
import { Map, TileLayer, Marker, Popup, LayerGroup, Circle } from 'react-leaflet';
import MarkerCluster from "./markercluster"
 
const defaultData = [{ lat: 52.008778, lon: -0.771088}];

class Livemap extends React.Component {
    constructor() {
        super();

        this.centerPosition = L.latLng(defaultData[0], defaultData[1]);
        this.maxBounds = null;
        this._data = [];
    }

    componentWillMount() {
        console.log("Props:"+this.props.parkingMetadata);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parkingMetadata.length) {
            this.maxBounds = L.latLngBounds(_.map(nextProps.parkingMetadata, (val)=>{return new L.LatLng(val.Latitude, val.Longitude);}));
            this.centerPosition = this.maxBounds.getCenter();
        }
    }
    
    render() {
        var self = this;

        return (
            <Map
                center={this.centerPosition}
                zoom={18}
                scrollWheelZoom="false"
                touchZoom="center"
                maxBounds={this.maxBounds}
            >
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <MarkerCluster parkingMetadata={this.props.parkingMetadata} data={this._data}/>
            </Map>
        );
    }
}

Livemap.propTypes = {
    parkingMetadata: React.PropTypes.array.isRequired,
    data: React.PropTypes.array.isRequired
};

Livemap.defaultProps = {
    data: defaultData
}

export default Livemap;
