import React from "react";
import ReactDOM from 'react-dom';
import {Meteor} from "meteor/meteor";
import Paper from 'material-ui/Paper';
import Slider from 'material-ui/Slider';
import Snackbar from 'material-ui/Snackbar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import FontIcon from "material-ui/FontIcon";
import {
  blue500,
  pink400,
  purple500,
} from 'material-ui/styles/colors';

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

const iconstyle = {margin: 5};

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
        <div className="flex-item-1-row">
          <Card expanded={false}>
            <CardHeader
              title="URL Avatar"
              subtitle="Subtitle"
              avatar={<Avatar
                        color={blue500}
                        style={iconstyle}
                        icon={<FontIcon className="material-icons" color={blue500}>local_parking</FontIcon>}
                      />}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText>
              <Toggle
                toggled={false}
                labelPosition="right"
                label="This toggle controls the expanded state of the component."
              />
            </CardText>
            <CardMedia
              expandable={true}
              overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
            >
              <img src="images/nature-600-337.jpg" />
            </CardMedia>
            <CardTitle title="Card title" subtitle="Card subtitle" expandable={true} />
            <CardText expandable={true}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
            <CardActions>
              <FlatButton label="Expand"/>
              <FlatButton label="Reduce"/>
            </CardActions>
          </Card>
          </div>
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
      </div>
    );
  }
}

ParkingApp.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default ParkingApp;

