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
    this.setCountries = this.setCountries.bind(this);
    this.keywordOptions = this.keywordOptions.bind(this);
    this.countryOptions = this.countryOptions.bind(this);
    this.keywordHandleChange = this.keywordHandleChange.bind(this);
    this.dataFeedHandleChange = this.dataFeedHandleChange.bind(this);
    this.countryHandleChange = this.countryHandleChange.bind(this);
    this.state = {
      series: this.getSeries([[new Date().valueOf(), 0]]),
      keywords: [],
      countries: ["any"],
      chosenKeyword: "trump",
      chosenDataFeed: "avg",
      chosenCountry: "any"
    };
  }

  componentDidMount() {
    this.setSeries(
      this.state.chosenKeyword,
      this.state.chosenDataFeed,
      this.state.chosenCountry
    );
    this.setKeywords();
    this.setCountries(this.state.chosenKeyword);
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

  setSeries(keyword, dataFeed, country) {
    axios
      .get("/api/analyzes/" + keyword + "?country=" + country)
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

  setCountries(keyword) {
    axios
      .get("/api/countries/" + keyword)
      .then(res => {
        this.setState({ countries: res.data });
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
    this.setCountries(keyword);
    this.setSeries(
      keyword,
      this.state.chosenDataFeed,
      this.state.chosenCountry
    );
  }

  dataFeedHandleChange(event) {
    var feed = event.target.value;
    this.setState({ chosenDataFeed: feed });
    this.setSeries(this.state.chosenKeyword, feed, this.state.chosenCountry);
  }

  countryHandleChange(event) {
    var country = event.target.value;
    this.setState({ chosenCountry: country });
    this.setSeries(
      this.state.chosenKeyword,
      this.state.chosenDataFeed,
      country
    );
  }

  keywordOptions() {
    return this.state.keywords.map(keyword => (
      <option key={keyword} value={keyword}>
        {keyword}
      </option>
    ));
  }

  countryOptions() {
    return this.state.countries.map(country => (
      <option key={country} value={country}>
        {country}
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
        <select
          value={this.state.chosenCountry}
          onChange={this.countryHandleChange}
        >
          {this.countryOptions()}
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
