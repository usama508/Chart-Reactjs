import React, { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import './index.css'
let symbol = "BTC";
let dataUrl =
  "https://min-api.cryptocompare.com/data/v2/histoday?fsym=" +
  symbol +
  "&tsym=USD&limit=400";
let priceUrl =
  "https://min-api.cryptocompare.com/data/price?fsym=" +
  symbol +
  "&tsyms=USD";
function App() {
  const [appState, setAppState] = useState({
    loading: false,
    data: null,
    price: null,
    volume: null,
  });
  useEffect(() => {
    setAppState({ loading: true });
    let arr = [];
    let arr1 = [];
    let volumeData = [];
    fetch(priceUrl)
      .then((response) => response.json())
      .then((data1) => {
        let price = data1.USD;
        arr1.push(price);
        fetch(dataUrl)
          .then((res) => res.json())
          .then((data) => {
            for (const key of data.Data.Data) {
              let data = [key.time * 1000, key.close];
              let volume = [key.time * 1000, key.volumeto];
              arr.push(data);
              volumeData.push(volume);
            }
            setAppState({ loading: false, data: arr, price: arr1, volume: volumeData });
          });
      });
  }, [setAppState]);
  let data = appState.data;
  let price = appState.price;
  let volume = appState.volume;
  const options = {
    chart: {
      backgroundColor: "white",
      type: "area",
      height: "500px",
    },
    title: {
      text: `<h1 id="chart-title" style="font-weight:800">${symbol} $${price}</h1>`,
      align: "left",
    },
    tooltip: {
      shared: true,
      formatter: function () {
        let s = `<b>${Highcharts.dateFormat("%A, %b %e, %Y", this.x)}</b>`;
        this.points.forEach(function (point) {
          s += `<br/>${point.series.name}: $${point.y}`;
        });
        return s;
      },
    },
    plotOptions: {
      series: {
        fillColor: {
          linearGradient: [0, 0, 0, 200],
          stops: [
            [0, Highcharts.getOptions().colors[2]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[2])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
        point: {
          events: {
            mouseOver: function () {
              const chart = this.series.chart;
              const xAxis = chart.xAxis[0];
              const yAxis = chart.yAxis[0];
              xAxis.removePlotLine("hover-line-x");
              yAxis.removePlotLine("hover-line-y");
              xAxis.addPlotLine({
                value: this.x,
                color: "gray",
                width: 1,
                dashStyle: 'dot',
                id: "hover-line-x",
                zIndex: 5,
              });
              yAxis.addPlotLine({
                value: this.y,
                color: "gray",
                width: 1,
                dashStyle: 'dot',
                id: "hover-line-y",
                zIndex: 5,
              });
            },
            mouseOut: function () {
              const chart = this.series.chart;
              const xAxis = chart.xAxis[0];
              const yAxis = chart.yAxis[0];
              xAxis.removePlotLine("hover-line-x");
              yAxis.removePlotLine("hover-line-y");
            },
          },
        },
      },
    },
    series: [
      {
        name: symbol,
        color: 'green',
        data: data,
        tooltip: {
          valueDecimals: 2,
        },
        zones: [
          {
            value: 20000,
            color: 'red',
          },
          {
            color: 'green',
          },
        ],
      },
      {
        name: 'Volume',
        type: 'column',
        yAxis: 1,
        data: volume,
        color: 'lightgray',
        tooltip: {
          valueDecimals: 0,
        },
      },
    ],
    rangeSelector: {
      buttons: [
          {
            type: 'day',
            count: 1,
            text: '1D',
          },
          {
            type: 'day',
            count: 7,
            text: '7D',
          },
          {
            type: 'month',
            count: 1,
            text: '1M',
          },
          {
            type: 'year',
            count: 1,
            text: '1Y',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
      selected: null,
      inputEnabled: false,
      buttonPosition: {
        align: 'right',
        x: -10,
        y: -10,
      },
      buttonTheme: {
        width: 50,
      },
      inputPosition: {
        align: 'right',
        x: 0,
        y: 0,
      },
      inputBoxWidth: 120,
    },
    yAxis: [
      {
        labels: {
          align: "right",
        },
        height: "60%",
        resize: {
          enabled: true,
        },
     
      },
      {
        labels: {
          align: "right",
        },
        top: "65%",
        height: "35%",
        left:"-2%",
        offset: 40,
      },
    ],
  };
  return (
    <div id="container" style={{width:'95%',margin:'auto'}}>
      <h1 style={{ textAlign: 'center' }}>Price Graph</h1>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
}
export default App;