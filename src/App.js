import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart
} from "react-timeseries-charts";
import { TimeSeries } from "pondjs";

class App extends Component {
  constructor(props) {
    super(props);
    this.setSeries = this.setSeries.bind(this);
    this.setTags = this.setTags.bind(this);
    this.options = this.options.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      series: this.getSeries([[new Date().valueOf(), 0]]),
      tags: [],
      chosen: "trump"
    };
  }

  componentDidMount() {
    this.setSeries(this.state.chosen);
    this.setTags();
  }

  getSeries(points) {
    var data = {
      name: "sentiment",
      columns: ["time", "value"],
      points: points
    };
    var series = new TimeSeries(data);
    return series;
  }

  setSeries(tag) {
    axios
      .get("/api/analyzes?name=" + tag)
      .then(res => {
        var points = res.data.map(point => [
          new Date(point.timestamp).valueOf(),
          point.reaction_avg
        ]);
        this.setState({ series: this.getSeries(points) });
      })
      .catch(error => {
        console.log(error);
      });
  }

  setTags() {
    axios
      .get("/api/tags")
      .then(res => {
        var tags = res.data.map(tag => tag.name);
        this.setState({ tags: tags });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChange(event) {
    var tag = event.target.value;
    this.setState({ chosen: tag });
    this.setSeries(tag);
  }

  options() {
    return this.state.tags.map(tag => (
      <option key={tag} value={tag}>
        {tag}
      </option>
    ));
  }

  render() {
    return (
      <div>
        <select value={this.state.chosen} onChange={this.handleChange}>
          {this.options()}
        </select>
        <ChartContainer timeRange={this.state.series.timerange()}>
          <ChartRow>
            <YAxis id="axis1" label={this.state.chosen} min={-0.5} max={0.5} />
            <Charts>
              <LineChart
                axis="axis1"
                series={this.state.series}
                column={["trump"]}
              />
            </Charts>
          </ChartRow>
        </ChartContainer>
      </div>
    );
  }
}

export default App;
