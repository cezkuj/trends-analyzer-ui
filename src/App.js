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
    this.setRates = this.setRates.bind(this);
    this.keywordOptions = this.keywordOptions.bind(this);
    this.countryOptions = this.countryOptions.bind(this);
    this.keywordHandleChange = this.keywordHandleChange.bind(this);
    this.dataFeedHandleChange = this.dataFeedHandleChange.bind(this);
    this.countryHandleChange = this.countryHandleChange.bind(this);
    this.baseCurHandleChange = this.baseCurHandleChange.bind(this);
    this.currencyHandleChange = this.currencyHandleChange.bind(this);
    this.stocksHandleChange = this.stocksHandleChange.bind(this);
    this.cryptoHandleChange = this.cryptoHandleChange.bind(this);
    this.cryptoBaseCurHandleChange = this.cryptoBaseCurHandleChange.bind(this);
    this.state = {
      series: this.getSeries([[new Date().valueOf(), 0]], "sentiment"),
      rates: this.getSeries([[new Date().valueOf(), 0]], "rates"),
      stocks: this.getSeries([[new Date().valueOf(), 0]], "stocks"),
      cryptos: this.getSeries([[new Date().valueOf(), 0]], "cryptos"),
      keywords: [],
      countries: ["any"],
      chosenKeyword: "trump",
      chosenDataFeed: "avg",
      chosenCountry: "any",
      chosenCurrency: "EUR",
      chosenBaseCur: "USD",
      chosenStock: "GE",
      chosenCrypto: "BTC",
      chosenCryptoBaseCur: "USD"
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

  getSeries(points, name) {
    var data = {
      name: name,
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
        this.setState({ series: this.getSeries(points, "sentiment") });
        this.setRates(
          this.state.chosenBaseCur,
          this.state.chosenCurrency,
          this.state.series.begin(),
          this.state.series.end()
        );
        this.setStocks(
          this.state.chosenStock,
          this.state.series.begin(),
          this.state.series.end()
        );
        this.setCryptos(
          this.state.chosenCrypto,
          this.state.chosenCryptoBaseCur,
          this.state.series.begin(),
          this.state.series.end()
        );
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

  setRates(baseCur, cur, startDate, endDate) {
    axios
      .get(
        "/api/rates/" +
          baseCur +
          "/" +
          cur +
          "?startDate=" +
          Date.parse(startDate) +
          "&endDate=" +
          Date.parse(endDate)
      )
      .then(res => {
        var rates = res.data.rates.map(rate => [
          new Date(rate.date).valueOf(),
          rate.val
        ]);
        //Overwrite first and last entry for better charts
        rates[0][0] = startDate;
        rates[rates.length - 1][0] = endDate;
        this.setState({ rates: this.getSeries(rates, "rates") });
      })
      .catch(error => {
        console.log(error);
      });
  }

  setStocks(symbol, startDate, endDate) {
    axios
      .get(
        "/api/stocks/" +
          symbol +
          "?startDate=" +
          Date.parse(startDate) +
          "&endDate=" +
          Date.parse(endDate)
      )
      .then(res => {
        var stocks = res.data.map(stock => [
          new Date(stock.time).valueOf(),
          stock.price
        ]);
        //Overwrite first and last entry for better chart
        stocks[0][0] = startDate;
        stocks[stocks.length - 1][0] = endDate;
        this.setState({ stocks: this.getSeries(stocks, "stocks") });
      })
      .catch(error => {
        console.log(error);
      });
  }
  setCryptos(crypto, base, startDate, endDate) {
    console.log(
      "/api/crypto/" +
        crypto +
        "/" +
        base +
        "?startDate=" +
        Date.parse(startDate) +
        "&endDate=" +
        Date.parse(endDate)
    );
    axios
      .get(
        "/api/crypto/" +
          crypto +
          "/" +
          base +
          "?startDate=" +
          Date.parse(startDate) +
          "&endDate=" +
          Date.parse(endDate)
      )
      .then(res => {
        var cryptos = res.data.map(c => [new Date(c.time).valueOf(), c.price]);
        //Overwrite first and last entry for better chart
        cryptos[0][0] = startDate;
        cryptos[cryptos.length - 1][0] = endDate;
        this.setState({ cryptos: this.getSeries(cryptos, "cryptos") });
      })
      .catch(error => {
        console.log(error);
      });
  }

  baseCurHandleChange(event) {
    var baseCur = event.target.value;
    this.setState({ chosenBaseCur: baseCur });
    this.setRates(
      baseCur,
      this.state.chosenCurrency,
      this.state.series.begin(),
      this.state.series.end()
    );
  }

  currencyHandleChange(event) {
    var currency = event.target.value;
    this.setState({ chosenCurrency: currency });
    this.setRates(
      this.state.chosenBaseCur,
      currency,
      this.state.series.begin(),
      this.state.series.end()
    );
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

  stocksHandleChange(event) {
    var symbol = event.target.value;
    this.setState({ chosenStock: symbol });
    this.setStocks(symbol, this.state.series.begin(), this.state.series.end());
  }

  cryptoBaseCurHandleChange(event) {
    var baseCur = event.target.value;
    this.setState({ chosenCryptoBaseCur: baseCur });
    this.setCryptos(
      this.state.chosenCrypto,
      baseCur,
      this.state.series.begin(),
      this.state.series.end()
    );
  }

  cryptoHandleChange(event) {
    var crypto = event.target.value;
    this.setState({ chosenCrypto: crypto });
    this.setCryptos(
      crypto,
      this.state.chosenCryptoBaseCur,
      this.state.series.begin(),
      this.state.series.end()
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
        <ChartContainer
          timeRange={this.state.series.timerange()}
          enablePanZoom={true}
        >
          <ChartRow>
            <YAxis
              id="axis1"
              label="sentiment"
              min={this.state.series.min()}
              max={this.state.series.max()}
              format=".3f"
            />
            <Charts>
              <LineChart
                axis="axis1"
                series={this.state.series}
                column={[this.state.chosenKeyword]}
              />
            </Charts>
          </ChartRow>
        </ChartContainer>

        <select
          value={this.state.chosenBaseCur}
          onChange={this.baseCurHandleChange}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="PLN">PLN</option>
        </select>
        <select
          value={this.state.chosenCurrency}
          onChange={this.currencyHandleChange}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <ChartContainer
          timeRange={this.state.rates.timerange()}
          enablePanZoom={true}
        >
          <ChartRow>
            <YAxis
              id="axis2"
              label="Currency rate"
              min={this.state.rates.min()}
              max={this.state.rates.max()}
              format=".3f"
            />
            <Charts>
              <LineChart
                axis="axis2"
                series={this.state.rates}
                column={[
                  this.state.chosenCurrency + "/" + this.state.chosenBaseCur
                ]}
              />
            </Charts>
          </ChartRow>
        </ChartContainer>

        <select
          value={this.state.chosenStock}
          onChange={this.stocksHandleChange}
        >
          <option value="GE">GE</option>
          <option value="BAC">BAC</option>
          <option value="F">F</option>
          <option value="NIO">NIO</option>
          <option value="ELAN">ELAN</option>
          <option value="CHK">CHK</option>
          <option value="SNAP">SNAP</option>
          <option value="ORCL">ORCL</option>
          <option value="T">T</option>
          <option value="C">C</option>
          <option value="MSFT">MSFT</option>
          <option value="GOOG">GOOG</option>
        </select>
        <ChartContainer
          timeRange={this.state.rates.timerange()}
          enablePanZoom={true}
        >
          <ChartRow>
            <YAxis
              id="axis3"
              label="stocks"
              min={this.state.stocks.min()}
              max={this.state.stocks.max()}
              format=".3f"
            />
            <Charts>
              <LineChart
                axis="axis3"
                series={this.state.stocks}
                column={[this.state.chosenStock]}
              />
            </Charts>
          </ChartRow>
        </ChartContainer>

        <select
          value={this.state.chosenCrypto}
          onChange={this.cryptoHandleChange}
        >
          <option value="BTC">BTC</option>
          <option value="BCH">BCH</option>
          <option value="LCC">LCC</option>
          <option value="DOGE">DOGE</option>
          <option value="ETH">ETH</option>
        </select>
        <select
          value={this.state.chosenCryptoBaseCur}
          onChange={this.cryptoBaseCurHandleChange}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <ChartContainer
          timeRange={this.state.cryptos.timerange()}
          enablePanZoom={true}
        >
          <ChartRow>
            <YAxis
              id="axis4"
              label="Cryptocurrency rate"
              min={this.state.cryptos.min()}
              max={this.state.cryptos.max()}
              format=".3f"
            />
            <Charts>
              <LineChart
                axis="axis4"
                series={this.state.cryptos}
                column={[
                  this.state.chosenCrypto + "/" + this.state.chosenCryptoBaseCur
                ]}
              />
            </Charts>
          </ChartRow>
        </ChartContainer>
      </div>
    );
  }
}

export default App;
