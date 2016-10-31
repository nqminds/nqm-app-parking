import React from 'react';
import ChartistGraph from 'react-chartist'
import Chartist from 'chartist';
import moment from 'moment'

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {}

    render() {
        var dataArr = _.map(this.props.data, (val)=>{
            return {x:val.timestamp, y:val.currentvalue};
        });

        console.log(dataArr);

        var data = {
            series: [{
                name: 'series-1',
                data: dataArr
            }]
        };

        var options = {
            onlyInteger: true,
                showPoint: false,
                lineSmooth: Chartist.Interpolation.step({
                    postpone: true,
                    fillHoles: false
                }),
            axisX: {
                type: Chartist.FixedScaleAxis,
                stretch: true,
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