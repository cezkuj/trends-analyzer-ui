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
    this.setKeywords = this.setKeywords.bind(this);
    this.keywordOptions = this.keywordOptions.bind(this);
    this.keywordHandleChange = this.keywordHandleChange.bind(this);
    this.dataFeedHandleChange = this.dataFeedHandleChange.bind(this);
    this.state = {
      series: this.getSeries([[new Date().valueOf(), 0]]),
      keywords: [],
      chosenKeyword: "trump",
      chosenDataFeed: "avg"
    };
  }

  componentDidMount() {
    this.setSeries(this.state.chosenKeyword, this.state.chosenDataFeed);
    this.setKeywords();
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

  setSeries(keyword, dataFeed) {
    axios
      .get("/api/analyzes?name=" + keyword)
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

  setKeywords() {
    axios
      .get("/api/keywords")
      .then(res => {
        var keywords = res.data.map(keyword => keyword.name);
        this.setState({ keywords: keywords });
      })
      .catch(error => {
        console.log(error);
      });
  }

  keywordHandleChange(event) {
    var keyword = event.target.value;
    this.setState({ chosenKeyword: keyword });
    this.setSeries(keyword, this.state.chosenDataFeed);
  }

  dataFeedHandleChange(event) {
    var feed = event.target.value;
    this.setState({ chosenDataFeed: feed });
    this.setSeries(this.state.chosenKeyword, feed);
  }

  keywordOptions() {
    return this.state.keywords.map(keyword => (
      <option key={keyword} value={keyword}>
        {keyword}
      </option>
    ));
  }

  render() {
    return (
      <div>
        <select
          value={this.state.chosenKeyword}
          onChange={this.keywordHandleChange}
        >
          {this.keywordOptions()}
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
            <YAxis
              id="axis1"
              label={this.state.chosen}
              min={this.state.series.min()}
              max={this.state.series.max()}
            />
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
