/*
https://github.com/Leaflet/Leaflet.markercluster
https://github.com/troutowicz/geoshare/blob/7f0c45d433a0d52d78e02da9a12b0d2156fcbedc/test/app/components/MarkerCluster.jsx
http://leaflet.github.io/Leaflet.markercluster/example/marker-clustering-realworld.388.html
https://github.com/Leaflet/Leaflet.markercluster#usage
*/

import React from "react";
import ReactDOM from 'react-dom';
import { Map, TileLayer, Marker, Popup, LayerGroup, Circle } from 'react-leaflet';
import MarkerCluster from "./markercluster"
 
const defaultData = [{ lat: 52.008778, lon: -0.771088}];

class Livemap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            centerPosition: L.latLng(defaultData[0], defaultData[1])
        };
    }

    componentWillMount() {
        if (this.props.centerPosition!=null)
            this.setState({centerPosition: this.props.centerPosition});
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.centerPosition!=null)
            this.setState({centerPosition: nextProps.centerPosition})
    }
    
    render() {
        let self = this;
        let markerComponent = null;

        if (!_.isEmpty(self.props.parkingMetadata)) {
            markerComponent =
                <MarkerCluster
                    parkingMetadata={self.props.parkingMetadata}
                    realTimeData={self.props.realTimeData}
                    onClickMarker={self.props.onClickMarker}
                />
        }


        return (
            <Map
                center={this.state.centerPosition}
                zoom={18}
                scrollWheelZoom={false}
                touchZoom={false}
                maxBounds={null}
                dragging={true}
            >
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {markerComponent}
            </Map>);
    }
}

Livemap.propTypes = {
    centerPosition: React.PropTypes.object.isRequired,
    parkingMetadata: React.PropTypes.object.isRequired,
    realTimeData: React.PropTypes.array.isRequired,
    onClickMarker: React.PropTypes.func.isRequired,
};

export default Livemap;
