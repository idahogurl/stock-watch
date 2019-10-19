import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { FelaComponent } from 'react-fela';
import ReactHighcharts from 'react-highcharts';

function GraphPlaceholder() {
  const style = {
    height: 500,
    border: '1px solid gainsboro',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    marginTop: '20px',
  };
  return (
    <FelaComponent style={style}>
      {({ className }) => (<strong className={className}>No Data Available</strong>)}
    </FelaComponent>
  );
}

function StockChart({ stocks }) {
  if (!stocks.length) {
    return <GraphPlaceholder />;
  }

  const { 0: first } = stocks;
  const { 0: startPoint } = first.chart;

  const config = {
    xAxis: {
      type: 'datetime',
      visible: true,
    },
    yAxis: {
      title: {
        text: 'Value ($)',
      },
    },
    tooltip: {
      shared: true,
      crosshairs: true,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
        pointStart: dayjs(startPoint.x).add(1, 'day'),
        pointInterval: 24 * 3600 * 1000, // one day
      },
    },
    title: {
      text: "",
    },
    series: stocks.map(({ id, chart }) => ({
      name: id,
      data: chart.map((v) => [new Date(v.x).getTime(), v.y]),
    })),
  };
  return <ReactHighcharts config={config} />;
}

StockChart.propTypes = {
  stocks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default StockChart;
