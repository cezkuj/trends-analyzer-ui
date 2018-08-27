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
    this.tagOptions = this.tagOptions.bind(this);
    this.tagHandleChange = this.tagHandleChange.bind(this);
    this.dataFeedHandleChange = this.dataFeedHandleChange.bind(this);
    this.state = {
      series: this.getSeries([[new Date().valueOf(), 0]]),
      tags: [],
      chosenTag: "trump",
      chosenDataFeed: "avg"
    };
  }

  componentDidMount() {
    this.setSeries(this.state.chosenTag, this.state.chosenDataFeed);
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

  setSeries(tag, dataFeed) {
    axios
      .get("/api/analyzes?name=" + tag)
      .then(res => {
        var points = res.data.map(point => [
          new Date(point.timestamp).valueOf(),
          point["reaction_" + dataFeed]
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

  tagHandleChange(event) {
    var tag = event.target.value;
    this.setState({ chosenTag: tag });
    this.setSeries(tag, this.state.chosenDataFeed);
  }
  dataFeedHandleChange(event) {
    var feed = event.target.value;
    this.setState({ chosenDataFeed: feed });
    this.setSeries(this.state.chosenTag, feed);
  }

  tagOptions() {
    return this.state.tags.map(tag => (
      <option key={tag} value={tag}>
        {tag}
      </option>
    ));
  }

  render() {
    return (
      <div>
        <select value={this.state.chosenTag} onChange={this.tagHandleChange}>
          {this.tagOptions()}
        </select>
        <select
          value={this.state.chosenDataFeed}
          onChange={this.dataFeedHandleChange}
        >
          <option value="avg">avg</option>
          <option value="news">news</option>
          <option value="tweets">tweets</option>
        </select>
        <ChartContainer timeRange={this.state.series.timerange()}>
          <ChartRow>
            <YAxis id="axis1" label={this.state.chosen} min={-1} max={1} />
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
