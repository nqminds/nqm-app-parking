import React from 'react';
import ChartistGraph from 'react-chartist'
import Chartist from 'chartist';
import moment from 'moment'

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        var data = {
            series: [{
                name: 'series-1',
                data: [{
                    x: new Date(143134652600),
                    y: 53
                }, {
                    x: new Date(143234652600),
                    y: 35
                }, {
                    x: new Date(143334652600),
                    y: 30
                }, {
                    x: new Date(143384652600),
                    y: 30
                }, {
                    x: new Date(143568652600),
                    y: 10
                }]
            }]
        };

        var options = {
            axisX: {
                type: Chartist.FixedScaleAxis,
                divisor: 5,
                labelInterpolationFnc: function (value) {
                    return moment(value).format('HH:mm');
                }
            }
        };

        return (<div>
                <ChartistGraph
                    data = {data}
                    options = {options}
                    type = 'Line'
                />
                </div>);
    }
}

Chart.propTypes = {
    data: React.PropTypes.array.isRequired
};

export default Chart;