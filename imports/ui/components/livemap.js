import React from "react";
import ReactDOM from 'react-dom';
import { Map, TileLayer, Marker, Popup, LayerGroup, Circle } from 'react-leaflet';
import MarkerCluster from "./markercluster"
 
const defaultData = [{ timestamp: 0, lat: 52.008778, lon: -0.771088, ele: 170 }];

class Livemap extends React.Component {
    constructor() {
        super();

        this.centerPosition = defaultData[0];
        this._data = [];
    }

    componentWillReceiveProps(nextProps) {
        let position = _.find(nextProps.data, function (el) { return el.ID == nextProps.clickBusID });

        if (position !== undefined)
            this.centerPosition = position;

        if (nextProps.data.length)
            this._data = nextProps.data.slice(0);
    }

    render() {
        var self = this;

        const busIcon = L.icon({ iconUrl: 'images/bus.png', iconSize: [32, 32], });

        /*
        var listMarker = _.map(this.props.parkingMetadata, function (d, i) {
            return <Marker key={i}
                position={[d.Latitude, d.Longitude]}
                clickable='true'
                title={d.Street}
                draggable='false'
                >
                <Popup>
                    <span>{d.Street}</span>
                </Popup>
            </Marker>
        });
        */

        return (
            <Map center={[this.centerPosition.lat, this.centerPosition.lon]} zoom={18}>
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
