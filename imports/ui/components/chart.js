import React from 'react';
import ChartistGraph from 'react-chartist'
import Chartist from 'chartist';
import moment from 'moment'
import * as _ from 'lodash'

const _xAxisDivisors = 6;

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {}

    render() {
        let graphData, barData, data, options;
        let responsiveOptions = "";
        let ret;
        let className = "analysis-"+this.props.type;

        if (this.props.type=="Line") {
            graphData = _.map(this.props.data, (val)=>{
                return {x:val.timestamp, y:val.currentvalue};
            });

            data = {
                series: [{
                    name: 'Timeseries',
                    data: graphData
                }]
            };

            options = {
                onlyInteger: true,
                showPoint: false,
                showArea: true,
                lineSmooth: Chartist.Interpolation.step({
                    postpone: false,
                    fillHoles: false
                }),
                axisX: {
                    type: Chartist.FixedScaleAxis,
                    stretch: true,
                    divisor: _xAxisDivisors,
                    labelInterpolationFnc: function (value) {
                        return moment(value).format('HH:mm');
                    }
                }
            };
            ret = (<div>
                <ChartistGraph
                    className={className}
                    data = {data}
                    options = {options}
                    type = {this.props.type}
                    responsive-options={responsiveOptions}
                />
                </div>);
        } else if (this.props.type=="Bar"){
            let bounds = [];

            if (this.props.barcount<=3) {
                for (i=0;i<=this.props.barcount;i++)
                    bounds.push([i,i,i]);
            } else {
                bounds.push([0,this.props.barcount/4,0]);
                bounds.push([this.props.barcount/4,this.props.barcount/2,1]);
                bounds.push([this.props.barcount/2,3*this.props.barcount/4,2]);
                bounds.push([3*this.props.barcount/4,this.props.barcount,3]);
            }
            

            graphData = _.fill(Array(bounds.length), 0);

            _.forEach(this.props.data, (val)=>{
                if (this.props.barcount<=3) {
                    _.forEach(bounds, (elb)=>{
                        if (val.currentvalue==elb[0])
                            graphData[elb[2]]++;
                    });
                } else {
                    _.forEach(bounds, (elb)=>{
                        if ((val.currentvalue>=elb[0] && val.currentvalue<elb[1] && elb[2]<3)
                             || (val.currentvalue==elb[1] && elb[2]==3))
                            graphData[elb[2]]++;
                    });
                }
            });

            data = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                series: [
                    [3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
                ]
            };

            options = {
                seriesBarDistance: 10
            };

            responsiveOptions = [
                ['screen and (max-width: 640px)', {
                    seriesBarDistance: 5,
                    axisX: {
                        labelInterpolationFnc: function (value) {
                        return value[0];
                        }
                    }
                }]
            ];

            ret=(<div>
                <ChartistGraph
                    className={className}
                    data = {data}
                    options = {options}
                    type = {this.props.type}
                    responsive-options={responsiveOptions}
                />
                </div>);
        }

        return ret
    }
}

Chart.propTypes = {
    data: React.PropTypes.array.isRequired,
    type: React.PropTypes.string.isRequired,
    barcount: React.PropTypes.number.isRequired
};

export default Chart;