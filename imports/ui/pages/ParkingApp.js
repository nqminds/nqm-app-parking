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
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import FontIcon from "material-ui/FontIcon";
import DatePicker from 'material-ui/DatePicker';
import { blue900, blue100 } from 'material-ui/styles/colors';
import 'leaflet';
import 'leaflet.markercluster';
import * as _ from "lodash";

import LivemapContainer from "./livemap-container"
import ChartContainer from "./chart-container"

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  }
};

const iconstyle = {margin: 5};
const buttonstyle = {margin:12};

class ParkingApp extends React.Component {
  constructor(props) {
    super(props);

    let date = new Date();
    
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    this.state = {
      currentMarker:null,
      snackBarMessage:"",
      snackBarOpen: false,
      smsToggleState: false,
      feedToggleState: false,
      cardExpanded: false,
      filterDate: date,
      analysisType: "Time series analysis",
      chartType: "Line"
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

  _onSendFeedData(data) {
  
  }

  handleFilterDate(event, date) {
    this.setState({
      filterDate: date
    });
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

  handleFeedSubscribeToggle() {
      if(this.state.feedToggleState) {
        this.setState({
          feedToggleState: false
        });
      } else {
        this.setState({
          feedToggleState: true
        });
      }
  }

  handleSnackbarClose() {
    this.setState({
      snackBarOpen: false
    });
  };

  handleExpandChange(expanded) {
    this.setState({
      cardExpanded: expanded
    });
  }

  handleTimeseriesClick() {

    this.setState({
      cardExpanded: true,
      analysisType: "Time series analysis",
      chartType: "Line"
    });
  }

  handleDistributionClick() {
    this.setState({
      cardExpanded: true,
      analysisType: "Distribution analysis",
      chartType: "Bar"
    });
  }

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
    let self = this;
    let mongodbOptions = { sort: { ID: -1 }};
    let optionsRow;

    const gte = this.state.filterDate.getTime();
    const lte = gte + 24*60*60*1000;
    
    const chartOptions = { sort: { timestamp: 1 }};
    const chartFilter = {ID: {$eq: this.state.currentMarker.LotCode}, "$and":[{"timestamp":{"$gte":gte}},{"timestamp":{"$lte":lte}}]};
    let lineChartVisibility, barChartVisibility;

    if (this.state.chartType=="Line") {
      lineChartVisibility={visibility:"", load: true};
      barChartVisibility={visibility:"hidden", load:false};
    } else {
      lineChartVisibility={visibility:"hidden", load:false};
      barChartVisibility={visibility:"", load: true};
    }

    if (this.state.currentMarker!=null) {
      optionsRow = (
        <div className="flex-item-1-row">
          <Card expanded={this.state.cardExpanded} onExpandChange={this.handleExpandChange.bind(this)}>
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
                toggled={this.state.feedToggleState}
                labelPosition="right"
                onToggle={this.handleFeedSubscribeToggle.bind(this)}
                label="Subscribe to live feed."
              />            
              <Toggle
                toggled={this.state.smsToggleState}
                labelPosition="right"
                onToggle={this.handleSmsSubscribeToggle.bind(this)}
                label="Subscribe to text message updates."
              />
            </CardText>
            <CardMedia
              expandable={true}
            >
            </CardMedia>
            <CardTitle subtitle={this.state.analysisType} expandable={true} />
            <CardText expandable={true}>
              <div id={lineChartVisibility.visibility}>
                <ChartContainer
                  resourceId={Meteor.settings.public.parkingTable}
                  filter={chartFilter}
                  options={chartOptions}
                  load={lineChartVisibility.load}
                  type="Line"
                  barcount={this.state.currentMarker.BayCount}
                />
              </div>
              <div id={barChartVisibility.visibility}>
                <ChartContainer
                  resourceId={Meteor.settings.public.parkingTable}
                  filter={chartFilter}
                  options={chartOptions}
                  load={barChartVisibility.load}
                  type="Bar"
                  barcount={this.state.currentMarker.BayCount}
                />
              </div>            
              <DatePicker
                autoOk={true}
                floatingLabelText="Filter date"
                value={this.state.filterDate}
                onChange={this.handleFilterDate.bind(this)}
              />
            </CardText>
            <CardActions>
              <RaisedButton
                label="Timeseries"
                primary={true}
                style={buttonstyle}
                icon={<FontIcon className="material-icons">show_chart</FontIcon>}
                onTouchTap={this.handleTimeseriesClick.bind(this)}
              />
              <RaisedButton
                label="Distribution"
                primary={true}
                style={buttonstyle}
                icon={<FontIcon className="material-icons">equalizer</FontIcon>}
                onTouchTap={this.handleDistributionClick.bind(this)}
              />
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
                onSendFeedData={self._onSendFeedData.bind(this)}
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

