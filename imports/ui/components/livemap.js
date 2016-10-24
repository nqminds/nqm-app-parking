import React from "react";
import ReactDOM from 'react-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const defaultID = 1;
const defaultData = [{ ID: defaultID, timestamp: 0, lat: 52.008778, lon: -0.771088, ele: 170 }];

class Livemap extends React.Component {
    constructor() {
        super();

        this.centerPosition = defaultData[0];
        this._data = [];//defaultData;
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

        console.log(this.props.data.length);
        
        const busIcon = L.icon({ iconUrl: 'images/bus.png', iconSize: [32, 32], });
        const listMarker = _.map(this._data, function (d, i) {
            let popupText = _.find(self.props.busData, function (el) { return el.ID == d.ID; });
            return <Marker key={i}
                position={[d.lat, d.lon]}
                clickable='true'
                icon={busIcon}
                title={popupText.Title}
                draggable='false'
                >
                <Popup>
                    <span>{popupText.Title}</span>
                </Popup>
            </Marker>
        });

        return (
            <Map center={[this.centerPosition.lat, this.centerPosition.lon]} zoom={18}>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                {listMarker}
            </Map>
        );
    }
}

Livemap.propTypes = {
    clickBusID: React.PropTypes.number.isRequired,
    busData: React.PropTypes.array.isRequired,
    data: React.PropTypes.array.isRequired
};

Livemap.defaultProps = {
    clickBusID: defaultID,
    data: defaultData
}

export default Livemap;
