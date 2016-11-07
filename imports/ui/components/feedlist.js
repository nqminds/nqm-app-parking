import React from "react";
import ReactDOM from 'react-dom';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FontIcon from "material-ui/FontIcon";
import { darkBlack, blue900, blue100 } from 'material-ui/styles/colors';
import * as _ from "lodash";
import Infinite from 'react-infinite'

const iconstyle = {margin: 5};

class FeedList extends React.Component {
    constructor(props) {
        super(props);

        this._onClickItemFeed = this._onClickItemFeed.bind(this);
    }

    _onClickItemFeed (id) {
        this.props.onItemClick(id);
    }

    render() {
        let self = this;
        let list = null;

        if (!_.isEmpty(this.props.parkingMetadata)) {
            let idMap = _.keyBy(this.props.feedData,'ID');
            list = [];

            _.forEach(this.props.feedList, (val,key)=>{
                let el = this.props.parkingMetadata[key];
                if (val) {
                    list.push(<ListItem
                        key={key}
                        leftAvatar={
                            <Avatar
                                color={blue900}
                                style={iconstyle}
                                icon={<FontIcon className="material-icons" color={blue900}>local_parking</FontIcon>}
                            />}
                        primaryText={el.Street}
                        secondaryText={
                            <p>
                                <span style={{color: darkBlack}}>{el.BayType}</span><br />
                                Available spaces: {idMap[key].currentvalue}
                            </p>
                        }
                        secondaryTextLines={2}
                        onClick={self._onClickItemFeed.bind(this, key)}
                    />);
                }
            });
        }

        return (
            <List>
                <Subheader>Live Feed</Subheader>
                <Infinite containerHeight={500} elementHeight={50}>
                    {list}
                </Infinite>
            </List>);
    }
}

FeedList.propTypes = {
    feedList: React.PropTypes.object.isRequired,
    parkingMetadata: React.PropTypes.object.isRequired,
    feedData: React.PropTypes.array.isRequired,
    onItemClick: React.PropTypes.func.isRequired
};

export default FeedList;

