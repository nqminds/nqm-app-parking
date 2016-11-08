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
import TDXAPI from "nqm-api-tdx/client-api";

import Livemap from "../components/livemap"
import ChartContainer from "./chart-container"
import connectionManager from "../../api/manager/connection-manager";
import FeedList from "../components/feedlist"

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

const iconstyle = {margin: 5};
const buttonstyle = {margin:12};

class ParkingApp extends React.Component {
  constructor(props) {
    super(props);

    this.tdxApi = new TDXAPI({
      commandHost: Meteor.settings.public.commandHost,
      queryHost: Meteor.settings.public.queryHost,
      accessToken: connectionManager.authToken
    });

    
    let date = new Date();
    
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    const currentMarker = {LotCode:0};
    this.state = {
      currentMarker:currentMarker,
      snackBarMessage:"",
      snackBarOpen: false,
      smsToggleState: false,
      cardExpanded: false,
      filterDate: date,
      liveFeed: {},
      parkingMetadata: {},
      analysisType: "Time series analysis",
      chartType: "Line"
    };
  }

  _onClickMarker(id) {
    let el = this.state.parkingMetadata[id];

    if (el!=undefined) {
      this.setState({
        currentMarker: el
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
      let dataFeed = {'ID':Number(this.state.currentMarker.LotCode), 'state':0};
      let currentLiveFeed = _.clone(this.state.liveFeed);
      let toggleState = false;

      if (this.state.liveFeed[this.state.currentMarker.LotCode]!=undefined)
        toggleState = this.state.liveFeed[this.state.currentMarker.LotCode];

      if(toggleState) {
        this.tdxApi.updateDatasetData(Meteor.settings.public.liveFeedSubscribtion, dataFeed, true, (err, response)=>{
          if(err) {
            this.setState({
              snackBarOpen: true,
              snackBarMessage: "Can't unsubscribe from feed!"
            });
          } else {
            currentLiveFeed[dataFeed.ID] = false;
            this.setState({
              liveFeed: currentLiveFeed
            });
          }
        });
      } else {
        dataFeed.state = 1;
        this.tdxApi.updateDatasetData(Meteor.settings.public.liveFeedSubscribtion, dataFeed, true, (err, response)=>{
          if(err) {
            this.setState({
              snackBarOpen: true,
              snackBarMessage: "Can't subscribe to feed!"
            });
          } else {
            currentLiveFeed[dataFeed.ID] = true;
            this.setState({
              liveFeed: currentLiveFeed              
            });
          }
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
    let parkingMetadata = {};

    this.tdxApi.getDatasetData(Meteor.settings.public.parkingMetadata, null, null, null, (err, data)=>{
      if (err) {
        this.setState({
          snackBarOpen: true,
          snackBarMessage: "No parking metadata available!"
        });  
      } else {
        if (!data.data.length){
          this.setState({
            snackBarOpen: true,
            snackBarMessage: "No parking metadata available!"
          });          
        } else {
          let minMarker = _.minBy(data.data,(val)=>{return val.LotCode});

          _.forEach(data.data, (val)=>{
            parkingMetadata[val.LotCode] = val;
          });

          this.setState({
            'currentMarker':minMarker,
            'parkingMetadata': parkingMetadata
          });
        }
      }
    });
  }

  componentDidMount() {
    let currentLiveFeed = {};

    this.tdxApi.getDatasetData(Meteor.settings.public.liveFeedSubscribtion, null, null, null, (err, data)=>{
      if(err) {
        this.setState({
          snackBarOpen: true,
          snackBarMessage: "Can't retrieve the live feed data!"
        });
      } else {
          _.forEach(data.data, (val)=>{
            currentLiveFeed[val.ID] = val.state;
          });

          this.setState({ liveFeed: currentLiveFeed });
      }
    });
  }

  render() {
    let self = this;
    let optionsRow;

    const gte = this.state.filterDate.getTime();
    const lte = gte + 24*60*60*1000;
    
    const chartOptions = { sort: { timestamp: 1 }};
    const chartFilter = {ID: {$eq: this.state.currentMarker.LotCode}, "$and":[{"timestamp":{"$gte":gte}},{"timestamp":{"$lte":lte}}]};
    let lineChartVisibility, barChartVisibility;
    let toggleState = false;

    let cPos = L.latLng(0, 0);

    const appBarHeight = Meteor.settings.public.showAppBar !== false ? 50 : 0;
    const leftPanelWidth = 380;
    const styles = {
      root: {
        height: "100%"
      },
      leftPanel: {
        position: "fixed",
        top: appBarHeight,
        bottom: 0,
        width: leftPanelWidth
      },
      mainPanel: {
        position: "absolute",        
        top: appBarHeight,
        bottom: 0,
        left: leftPanelWidth,
        right: 0
      }
    };

    if (this.state.chartType=="Line") {
      lineChartVisibility={visibility:"", load: true};
      barChartVisibility={visibility:"hidden", load:false};
    } else {
      lineChartVisibility={visibility:"hidden", load:false};
      barChartVisibility={visibility:"", load: true};
    }

    if (this.state.currentMarker!=null) {

      if (this.state.liveFeed[this.state.currentMarker.LotCode]!=undefined)
        toggleState = this.state.liveFeed[this.state.currentMarker.LotCode]? true : false;

      if (this.state.currentMarker.Latitude!=undefined && this.state.currentMarker.Longitude!=undefined)
        cPos = L.latLng(this.state.currentMarker.Latitude,
                          this.state.currentMarker.Longitude);

      optionsRow = (
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
                toggled={toggleState}
                labelPosition="right"
                onToggle={this.handleFeedSubscribeToggle.bind(this)}
                label="Subscribe to live feed."
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
          </Card>);
    }
    
    return (
        <div style={styles.root}>
          <div style={styles.leftPanel}>
            <div className="flex-container-column">
              <div className="flex-item-1-column">
                {optionsRow}
              </div>
              <div className="flex-item-2-column">
                  <FeedList
                    feedList={this.state.liveFeed}
                    parkingMetadata={this.state.parkingMetadata}
                    feedData={this.props.data}
                    onItemClick={self._onClickMarker.bind(this)}
                  />
              </div>
            </div>
          </div>
          <div style={styles.mainPanel}>
              <Livemap
                parkingMetadata={this.state.parkingMetadata}
                realTimeData={this.props.data}
                onClickMarker={self._onClickMarker.bind(this)}
                centerPosition={cPos}
              />
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

