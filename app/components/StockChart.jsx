import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FlexibleXYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, Crosshair, DiscreteColorLegend } from 'react-vis';
import palette from 'google-palette';
import dayjs from 'dayjs';

const formatTickValue = function formatTickValue(dateTime) {
  return dayjs(dateTime).format('MMM DD');
};

class StockChart extends Component {
    state = {
      crosshairValues: null,
    };

    onMouseLeave = this.onMouseLeave.bind(this)
    onNearestX = this.onNearestX.bind(this)

    onMouseLeave() {
      this.setState({ crosshairValues: null });
    }

    onNearestX(_, { index }) {
      const { stocks } = this.props;

      this.setState({ crosshairValues: stocks.map(s => s.chart[index]) });
    }

    render() {
      const { stocks } = this.props;
      const { crosshairValues } = this.state;
      const colors = palette('tol-rainbow', stocks.length).map(c => `#${c}`);

      const lineSeries = stocks.map((s, index) => (<LineSeries
        key={s.symbol}
        color={colors[index]}
        data={s.chart}
        onNearestX={this.onNearestX}
      />));

      return (
        <Fragment>
          <div style={{ height: 500 }}>
            <FlexibleXYPlot
              xType="time"
              animation="true"
              onMouseLeave={this.onMouseLeave}
              getX={d => new Date(d.x)}
            >
              <HorizontalGridLines />
              {lineSeries}
              <XAxis tickFormat={v => formatTickValue(v)} />
              <YAxis tickFormat={v => `$${v}`} />
              {crosshairValues &&
                <Crosshair values={crosshairValues}>
                  <div className="p-2" style={{ backgroundColor: 'rgba(0,0,0,.7)', width: '120px' }}>
                    <p><strong>{dayjs(crosshairValues[0].x).format('MMM DD, YYYY')}</strong></p>
                    <ul className="list-unstyled">
                      {stocks.map((s, index) => (
                        <li key={s.symbol}>{s.symbol}: ${crosshairValues[index].y}</li>))
                      }
                    </ul>
                  </div>
                </Crosshair>}
            </FlexibleXYPlot>
          </div>
          <DiscreteColorLegend orientation="horizontal" items={stocks.map(d => d.symbol)} colors={colors} />
        </Fragment>
      );
    }
}

StockChart.propTypes = {
  stocks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default StockChart;
