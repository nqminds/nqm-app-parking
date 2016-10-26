import React from "react";
import ReactDOM from 'react-dom';
import {Meteor} from "meteor/meteor";
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import LivemapContainer from "./livemap-container"

require('leaflet');
require('leaflet.markercluster');

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
              />
        </div>
        </div>
      </div>  
    );
  }
}

ParkingApp.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default ParkingApp;

