import React, { Component } from 'react';
import './App.css';

import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import { TimeSeries } from "pondjs";


var pointsJSON = require('./data.json')
var points = pointsJSON.map(point => [new Date(point.timestamp).valueOf(), point.reaction_avg])
const data = {
    name: "sentiment",
    columns: ["time", "value"],
    points: points
};
console.log(data)

const series = new TimeSeries(data);

class App extends Component {
  render() {
     return (
        <ChartContainer timeRange={series.timerange()}>
            <ChartRow >
                <YAxis id="axis1" label="trump" min={-0.3} max={0.3} />
                <Charts>
                    <LineChart axis="axis1" series={series} column={["trump"]}/>
                </Charts>
            </ChartRow>
        </ChartContainer>
    );
  }
}

export default App;
