import React from 'react';
import {
  FlexibleXYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, Crosshair, DiscreteColorLegend,
} from 'react-vis';
import palette from 'google-palette';
import dayjs from 'dayjs';
import { FelaComponent } from 'react-fela';

const formatTickValue = function formatTickValue(dateTime) {
  return dayjs(dateTime).format('MMM DD');
};

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
  if (stocks.length === 0) {
    return <GraphPlaceholder />;
  }
  const [crosshairValues, setCrosshairValues] = React.useState(null);

  function onMouseLeave() {
    setCrosshairValues(null);
  }

  function onNearestX(_, { index }) {
    setCrosshairValues(stocks.map((s) => s.chart[index]));
  }

  const colors = palette('tol-rainbow', stocks.length).map((c) => `#${c}`);

  const lineSeries = stocks.map((s, index) => (
    <LineSeries
      key={s.id}
      color={colors[index]}
      data={s.chart}
      onNearestX={onNearestX}
    />
  ));
  return (
    <>
      <div style={{ height: 500 }}>
        <FlexibleXYPlot
          xType="time"
          animation="true"
          onMouseLeave={onMouseLeave}
          getX={(d) => new Date(d.x)}
        >
          <HorizontalGridLines />
          {lineSeries}
          <XAxis tickFormat={(v) => formatTickValue(v)} />
          <YAxis tickFormat={(v) => `$${v}`} />
          {crosshairValues
                && (
                <Crosshair values={crosshairValues}>
                  <div className="p-2" style={{ backgroundColor: 'rgba(0,0,0,.7)', width: '120px' }}>
                    <p><strong>{dayjs(crosshairValues[0].x).format('MMM DD, YYYY')}</strong></p>
                    <ul className="list-unstyled">
                      {stocks.map((s, index) => (
                        <li key={s.id}>
                          {`${s.id}: $${crosshairValues[index].y}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Crosshair>
                )}
        </FlexibleXYPlot>
      </div>
      <DiscreteColorLegend orientation="horizontal" items={stocks.map((d) => d.id)} colors={colors} />
    </>
  );
}

export default StockChart;
