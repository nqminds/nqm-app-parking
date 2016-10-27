import React from "react";
import ReactDOM from 'react-dom';
import {Meteor} from "meteor/meteor";
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import 'leaflet';
import 'leaflet.markercluster';

import LivemapContainer from "./livemap-container"
import Chart from "../components/chart"
const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  }
};

class ParkingApp extends React.Component {
  constructor(props) {
    super(props);

  }

  _onClickMarker(id) {
    console.log(id);
  }

  render() {
    var self = this;
    //var mongodbFilter = {ID: {$eq: 21}};
    var mongodbOptions = { sort: { ID: -1 }};

    return (
      <div className="flex-container-row">
        <div className="flex-item-2-row">
          <div className="leaflet-container">
              <LivemapContainer
                resourceId={Meteor.settings.public.parkingTableLatest}
                options={mongodbOptions}
                parkingMetadata={self.props.data}
                onClickMarker={self._onClickMarker.bind(this)}
              />
          </div>
        </div>
        <div className="flex-item-1-row">
          <Paper zDepth={1}>
            <Chart/>
          </Paper>
        </div>
      </div>  
    );
  }
}

ParkingApp.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default ParkingApp;

