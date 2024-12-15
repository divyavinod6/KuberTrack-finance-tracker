import React from 'react';
import { Line } from '@ant-design/charts';

function ChartsComponent() {
  const data = [{ year: '1991', value: 3 }];

  const config = {
    data,
    width: 800,
    height: 400,
    autoFit: false,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };
  let chart;
  return (
    <div>
      {
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      }
    </div>
  );
}

export default ChartsComponent;
