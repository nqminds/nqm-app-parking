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
            centerPosition: L.latLng(defaultData[0], defaultData[1]),
            maxBounds: null
        };

        this._data = [];
        this._setMapBounds = this._setMapBounds.bind(this);
    }

    _setMapBounds(parkingMetadata) {
        let bounds = L.latLngBounds(_.map(parkingMetadata, (val) => {
            return new L.LatLng(val.Latitude, val.Longitude);
        }));


        this.setState({
            centerPosition: bounds.getCenter(),
            maxBounds: bounds
        });
        console.log(this.state.maxBounds);
    }

    componentWillMount() {
        if (this.props.parkingMetadata.length) {
            let bounds = L.latLngBounds(_.map(this.props.parkingMetadata, (val) => {
                return new L.LatLng(val.Latitude, val.Longitude);
            }));


            this.setState({
                centerPosition: bounds.getCenter(),
                maxBounds: bounds
            });
            //this._setMapBounds(this.props.parkingMetadata);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parkingMetadata.length && this.maxBounds==null) {
            //this._setMapBounds.bind(this, nextProps.parkingMetadata);
            
            let bounds = L.latLngBounds(_.map(nextProps.parkingMetadata, (val) => {
                return new L.LatLng(val.Latitude, val.Longitude);
            }));


            this.setState({
                centerPosition: bounds.getCenter(),
                maxBounds: bounds
            });
            
        }
    }
    
    render() {
        var self = this;

            let bounds = L.latLngBounds(_.map(this.props.parkingMetadata, (val) => {
                return new L.LatLng(val.Latitude, val.Longitude);
            }));

        console.log("LiveMap");

        return (
            <Map
                center={bounds.getCenter()}
                zoom={18}
                scrollWheelZoom="false"
                touchZoom="center"
                maxBounds={bounds}
            >
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <MarkerCluster parkingMetadata={self.props.parkingMetadata} data={self._data}/>
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
