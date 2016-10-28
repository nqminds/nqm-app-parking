import React from 'react';
import * as d3 from 'd3'

const _margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
};

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.svg = null;
        this.g = null;
    }

    componentDidMount() {

        this.svg = d3.select("#parkchart");
        this.g = this.svg.append("g").attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");
        
        /*
        d3.tsv("data.tsv", function (d) {
            d.date = parseTime(d.date);

            d.close = +d.close;
            return d;
        }, function (error, data) {
            if (error) throw error;
        */

        /*
        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));

        y.domain(d3.extent(data, function (d) {
            return d.close;
        }));

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("Bay count");

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
        */
    }

    componentWillReceiveProps(nextProps) {
        var width = +this.svg.attr("width") - _margin.left - _margin.right;
        var height = +this.svg.attr("height") - _margin.top - _margin.bottom;
        var parseTime = d3.timeParse("%H:%M:%S");

        var x = d3.scaleTime().rangeRound([0, width]);
        
        var y = d3.scaleLinear()
            .rangeRound([height, 0]);
        
        var line = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.close);
            });

        let data = _.map(nextProps.data,(val)=>{
                        let date = new Date(val.timestamp);
                        let time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
                        return {date:parseTime(time),currentval:+val.currentvalue}}
                    );
        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));

        y.domain(d3.extent(data, function (d) {
            return d.currentval;
        }));

        this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        this.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("Bay count");

        this.g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    }
    
    render() {
        return <svg id = "parkchart"
                    width = "470"
                    height = "400"
                    viewBox = "0 0 470 400"
                    preserveAspectRatio = "xMidYMid meet"/> ;
    }
}

Chart.propTypes = {
    data: React.PropTypes.array.isRequired
};

export default Chart;