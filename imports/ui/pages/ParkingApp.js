"use strict";

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
  blue900,
  blue100
} from 'material-ui/styles/colors';

import 'leaflet';
import 'leaflet.markercluster';
import * as _ from "lodash";

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

    this.state = {
      currentMarker:null,
      snackBarMessage:"",
      snackBarOpen: false,
      smsToggleState: false
    };
  }

  _onClickMarker(id) {
    let el = _.find(this.props.data, function(val) { return val.LotCode ==id; });
    if (el!=undefined) {
      this.setState({
        currentMarker:el
      });
    }  
  }

  handleSmsSubscribeToggle() {
      if(this.state.smsToggleState) {
        this.setState({
          smsToggleState: false
        });
      } else {
        this.setState({
          smsToggleState: true
        });
      }
  }

  handleSnackbarClose() {
    this.setState({
      snackBarOpen: false
    });
  };

  componentWillMount() {
    if (this.props.data.length) {
      let minMarker = _.minBy(this.props.data,(val)=>{return val.LotCode});
      this.setState({
        currentMarker:minMarker
      });
    } else {
      this.setState({
        snackBarOpen: true,
        snackBarMessage: "No parking metadata available!"
      });
    }
  }

  render() {
    var self = this;
    //var mongodbFilter = {ID: {$eq: 21}};
    var mongodbOptions = { sort: { ID: -1 }};
    var optionsRow;
    
    if (this.state.currentMarker!=null) {
      optionsRow = (
        <div className="flex-item-1-row">
          <Card expanded={false}>
            <CardHeader
              title={this.state.currentMarker.Street}
              subtitle={this.state.currentMarker.BayType}
              avatar={<Avatar
                        color={blue900}
                        backgroundColor={blue100}
                        style={iconstyle}
                        icon={<FontIcon className="material-icons" color={blue900}>local_parking</FontIcon>}
                      />}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText>
              <Toggle
                toggled={this.state.smsToggleState}
                labelPosition="right"
                onToggle={this.handleSmsSubscribeToggle.bind(this)}
                label="Subscribe to text messages updates."
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
        </div>);
    }

    return (
      <div>
        <div className="flex-container-row">
          {optionsRow}
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
        <Snackbar
          open={this.state.snackBarOpen}
          message={this.state.snackBarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbarClose.bind(this)}
        />        
      </div>
    );
  }
}

ParkingApp.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default ParkingApp;

